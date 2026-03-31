/**
 * PostRide.jsx
 * ─────────────────────────────────────────────────────────────
 * FIXES:
 *  ✅ Custom Places search — NO library, direct API fetch → suggestions ALWAYS show
 *  ✅ "Use current location" → drops pin on map, closes modal instantly
 *  ✅ Modal closes after selecting any suggestion
 *  ✅ Real route timing from Google Directions API
 *  ✅ All 6 steps scroll correctly
 *
 * EXPO INSTALL:
 *   npx expo install react-native-maps expo-location
 *
 * app.json → inside "expo":
 *   "android": { "config": { "googleMaps": { "apiKey": "YOUR_KEY" } } }
 *   "ios":     { "config": { "googleMapsApiKey": "YOUR_KEY" } }
 *   "plugins": [["expo-location", {"locationWhenInUsePermission": "Allow location access."}]]
 * ─────────────────────────────────────────────────────────────
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, TextInput,
  StyleSheet, SafeAreaView, Modal, Dimensions,
  ActivityIndicator, Platform, Alert, StatusBar, Linking,
  FlatList, Keyboard,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';

const { width } = Dimensions.get('window');

// ─── 🔑 REPLACE WITH YOUR KEY ─────────────────────────────────
const GKEY = 'AIzaSyA5gLPaJ-H_Ex-IBvz7Je6nGIE80wMj9is';

// ─── Types ─────────────────────────────────────────────────────

// ─── Decode polyline ────────────────────────────────────────────
function decodePoly(enc) {
  const pts = [];
  let i = 0, lat = 0, lng = 0;
  while (i < enc.length) {
    let b, s = 0, r = 0;
    do { b = enc.charCodeAt(i++) - 63; r |= (b & 0x1f) << s; s += 5; } while (b >= 0x20);
    lat += (r & 1) ? ~(r >> 1) : (r >> 1); s = 0; r = 0;
    do { b = enc.charCodeAt(i++) - 63; r |= (b & 0x1f) << s; s += 5; } while (b >= 0x20);
    lng += (r & 1) ? ~(r >> 1) : (r >> 1);
    pts.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
  }
  return pts;
}

// ─── Directions API ─────────────────────────────────────────────
async function getRoutes(o, d) {
  try {
    const url = `https://maps.googleapis.com/maps/api/directions/json`
      + `?origin=${o.latitude},${o.longitude}`
      + `&destination=${d.latitude},${d.longitude}`
      + `&alternatives=true&region=in&key=${GKEY}`;
    const json = await (await fetch(url)).json();
    if (json.status !== 'OK') return [];
    return json.routes.map((r, idx) => {
      const leg = r.legs[0];
      const hasTolls = (r.warnings ?? []).some((w) => w.toLowerCase().includes('toll'))
        || (leg.steps ?? []).some((st) => (st.html_instructions ?? '').toLowerCase().includes('toll'));
      return {
        idx,
        label:       `${leg.duration.text} · ${hasTolls ? 'Tolls' : 'No tolls'}`,
        sublabel:    `${leg.distance.text} · ${r.summary}`,
        durationSec: leg.duration.value,
        distanceM:   leg.distance.value,
        points:      decodePoly(r.overview_polyline.points),
      };
    });
  } catch (e) { return []; }
}

// ─── Places Autocomplete API (direct fetch — no library) ─────────
// Returns predictions array OR throws an error string so UI can show it
async function getPlacePredictions(query, bias) {
  if (query.trim().length < 2) return { predictions: [] };

  try {
    // Build URL
    let url =
      `https://maps.googleapis.com/maps/api/place/autocomplete/json` +
      `?input=${encodeURIComponent(query)}` +
      `&language=en` +
      `&key=${GKEY}`;

    if (bias) {
      url += `&location=${bias.latitude},${bias.longitude}&radius=50000&strictbounds=false`;
    }

    const response = await fetch(url);
    const json = await response.json();

    // API status handling
    if (json.status === 'ZERO_RESULTS') {
      return { predictions: [] };
    }

    if (json.status !== 'OK') {
      return {
        predictions: [],
        error: `API error: ${json.status}${json.error_message ? ' — ' + json.error_message : ''}`,
      };
    }

    const predictions = (json.predictions || []).map((p) => ({
      placeId: p.place_id,
      main: p.structured_formatting?.main_text || p.description,
      secondary: p.structured_formatting?.secondary_text || '',
    }));

    return { predictions };

  } catch (e) {
    return {
      predictions: [],
      error: `Network error: ${e?.message || 'unknown'}`,
    };
  }
}
// ─── Place Details (get lat/lng from placeId) ───────────────────
async function getPlaceDetails(placeId) {
  try {
    const url =
      `https://maps.googleapis.com/maps/api/place/details/json` +
      `?place_id=${placeId}` +
      `&fields=geometry,name,formatted_address` +
      `&key=${GKEY}`;
    const json = await (await fetch(url)).json();
    const loc  = json.result?.geometry?.location;
    if (!loc) return null;
    return { latitude: loc.lat, longitude: loc.lng };
  } catch {
    return null;
  }
}

const RCOLS = ['#0070F3', '#E87F00', '#8B44CA'];

// ══════════════════════════════════════════════════════════════
//  LOCATION SEARCH MODAL — custom, no external library
// ══════════════════════════════════════════════════════════════


const LocModal = ({ visible, title, userCoords, onSelect, onClose }) => {
  const [query,       setQuery]       = useState('');
  const [predictions, setPredictions] = useState([]);
  const [loading,     setLoading]     = useState(false);
  const [apiError,    setApiError]    = useState(null);
  const [locLoading,  setLocLoading]  = useState(false);
  const inputRef = useRef(null);
  const debounce = useRef(null);

  // Reset on open
  useEffect(() => {
    if (visible) {
      setQuery('');
      setPredictions([]);
      setApiError(null);
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [visible]);

  // Search as user types
  const onChangeText = (text) => {
    setQuery(text);
    setApiError(null);
    if (debounce.current) clearTimeout(debounce.current);
    if (text.trim().length < 2) { setPredictions([]); return; }
    setLoading(true);
    debounce.current = setTimeout(async () => {
      const { predictions: preds, error } = await getPlacePredictions(text, userCoords ?? undefined);
      setPredictions(preds);
      console.log({preds})
      setApiError(error ?? null);
      setLoading(false);
    }, 350);
  };

  // Tap a suggestion
  const onPickSuggestion = async (pred) => {
    Keyboard.dismiss();
    setLoading(true);
    const coords = await getPlaceDetails(pred.placeId);
    setLoading(false);
    if (!coords) { Alert.alert('Error', 'Could not get location details.'); return; }
    onSelect({ name: pred.main, address: `${pred.main}, ${pred.secondary}`, coords });
    onClose();
  };

  // "Use current location" button
  const onUseCurrentLocation = async () => {
    if (!userCoords) {
      Alert.alert('Location not available', 'Please allow location permission first.');
      return;
    }
    setLocLoading(true);
    try {
      // Reverse geocode to get a human-readable address
      const [geo] = await Location.reverseGeocodeAsync(userCoords);
      const name  = geo?.name ?? geo?.street ?? 'Current Location';
      const addr  = [geo?.street, geo?.city, geo?.region].filter(Boolean).join(', ');
      onSelect({ name, address: addr || 'Current Location', coords: userCoords });
      onClose();
    } catch {
      // Fallback if reverse geocode fails
      onSelect({ name: 'Current Location', address: 'Current Location', coords: userCoords });
      onClose();
    } finally {
      setLocLoading(false);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={lm.safe}>

        {/* Header */}
        <View style={lm.header}>
          <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
            <Text style={lm.back}>←</Text>
          </TouchableOpacity>
          <Text style={lm.title}>{title}</Text>
          <View style={{ width: 36 }} />
        </View>

        {/* Search Input */}
        <View style={lm.inputWrap}>
          <Text style={lm.searchIcon}>🔍</Text>
          <TextInput
            ref={inputRef}
            style={lm.input}
            placeholder="Enter the full address"
            placeholderTextColor="#AAB4C4"
            value={query}
            onChangeText={onChangeText}
            autoCorrect={false}
            autoComplete="off"
            returnKeyType="search"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => { setQuery(''); setPredictions([]); }}>
              <Text style={lm.clearBtn}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Use Current Location row */}
        <TouchableOpacity style={lm.currentLocRow} onPress={onUseCurrentLocation} activeOpacity={0.75}>
          <View style={lm.currentLocIcon}>
            {locLoading
              ? <ActivityIndicator size="small" color="#0070F3" />
              : <Text style={{ fontSize: 18 }}>📍</Text>
            }
          </View>
          <View style={{ flex: 1 }}>
            <Text style={lm.currentLocTitle}>Use current location</Text>
            {userCoords && (
              <Text style={lm.currentLocSub}>
                {userCoords.latitude.toFixed(4)}, {userCoords.longitude.toFixed(4)}
              </Text>
            )}
          </View>
          <Text style={lm.currentLocChevron}>›</Text>
        </TouchableOpacity>

        <View style={lm.divider} />

        {/* Loading indicator */}
        {loading && (
          <View style={lm.loadingRow}>
            <ActivityIndicator size="small" color="#0070F3" />
            <Text style={lm.loadingTxt}>  Searching…</Text>
          </View>
        )}

        {/* API Error — show exact error so user/developer can fix it */}
        {!loading && apiError && (
          <View style={lm.errorBox}>
            <Text style={lm.errorTitle}>⚠ Could not load suggestions</Text>
            <Text style={lm.errorMsg}>{apiError}</Text>
            <Text style={lm.errorHint}>
              Make sure Places API is enabled in Google Cloud Console and your API key has no HTTP referrer restrictions.
            </Text>
          </View>
        )}

        {/* No results */}
        {!loading && !apiError && predictions.length === 0 && query.trim().length >= 2 && (
          <View style={lm.emptyRow}>
            <Text style={{ fontSize: 32, marginBottom: 8 }}>🔍</Text>
            <Text style={lm.emptyTxt}>No results for {query}</Text>
            <Text style={lm.emptySub}>Try a different spelling or shorter keyword</Text>
          </View>
        )}

        {/* Suggestions list */}
        <FlatList
          data={predictions}
          keyExtractor={p => p.placeId}
          keyboardShouldPersistTaps="always"
          renderItem={({ item }) => (
            <TouchableOpacity style={lm.resultRow} onPress={() => onPickSuggestion(item)} activeOpacity={0.7}>
              <View style={lm.resultIcon}>
                <Text style={{ fontSize: 16 }}>📍</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={lm.resultMain} numberOfLines={1}>{item.main}</Text>
                {!!item.secondary && (
                  <Text style={lm.resultSub} numberOfLines={1}>{item.secondary}</Text>
                )}
              </View>
              <Text style={{ color: '#C5CDD8', fontSize: 18 }}>›</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={lm.divider} />}
        />
      </SafeAreaView>
    </Modal>
  );
};

const lm = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#E8EEF8' },
  back:   { fontSize: 24, color: '#0070F3', fontWeight: '800' },
  title:  { flex: 1, textAlign: 'center', fontSize: 17, fontWeight: '800', color: '#003580' },

  inputWrap: { flexDirection: 'row', alignItems: 'center', margin: 12, backgroundColor: '#F2F5FB', borderRadius: 14, paddingHorizontal: 14, height: 52 },
  searchIcon:{ fontSize: 17, marginRight: 8 },
  input:     { flex: 1, fontSize: 15, color: '#1A2332', fontWeight: '500' },
  clearBtn:  { fontSize: 16, color: '#AAB4C4', paddingLeft: 8 },

  currentLocRow:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  currentLocIcon: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#EBF3FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  currentLocTitle:{ fontSize: 14, fontWeight: '700', color: '#0070F3' },
  currentLocSub:  { fontSize: 11, color: '#8A9BB0', marginTop: 1 },
  currentLocChevron: { fontSize: 20, color: '#C5CDD8' },

  divider:    { height: 1, backgroundColor: '#F0F4FA' },
  loadingRow: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  loadingTxt: { fontSize: 13, color: '#8A9BB0', fontWeight: '500' },

  errorBox:   { margin: 16, backgroundColor: '#FFF3F3', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#FFCDD2' },
  errorTitle: { fontSize: 14, fontWeight: '800', color: '#C62828', marginBottom: 4 },
  errorMsg:   { fontSize: 12, color: '#B71C1C', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace', marginBottom: 8 },
  errorHint:  { fontSize: 12, color: '#8A9BB0', lineHeight: 18 },

  emptyRow:   { padding: 32, alignItems: 'center' },
  emptyTxt:   { fontSize: 15, color: '#4A5568', fontWeight: '700', textAlign: 'center' },
  emptySub:   { fontSize: 13, color: '#8A9BB0', marginTop: 6, textAlign: 'center' },

  resultRow:  { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  resultIcon: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#EBF3FF', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  resultMain: { fontSize: 14, fontWeight: '700', color: '#1A2332' },
  resultSub:  { fontSize: 12, color: '#8A9BB0', marginTop: 2 },
});

// ─── Section header ─────────────────────────────────────────────
const SH = ({ n, title, done }) => (
  <View style={sh.row}>
    <View style={[sh.badge, done && sh.done]}><Text style={sh.num}>{done ? '✓' : n}</Text></View>
    <Text style={sh.title}>{title}</Text>
  </View>
);
const sh = StyleSheet.create({
  row:   { flexDirection:'row', alignItems:'center', paddingHorizontal:20, paddingTop:22, paddingBottom:10 },
  badge: { width:26, height:26, borderRadius:13, backgroundColor:'#003580', alignItems:'center', justifyContent:'center', marginRight:10 },
  done:  { backgroundColor:'#1A7A4A' },
  num:   { color:'#fff', fontSize:11, fontWeight:'800' },
  title: { fontSize:16, fontWeight:'800', color:'#003580', flex:1 },
});

// ─── Clock modal ────────────────────────────────────────────────
const ClockModal = ({ visible, hour, minute, onConfirm, onClose }) => {
  const [h, setH] = useState(hour);
  const [m, setM] = useState(minute);
  const [editH, setEditH] = useState(true);
  useEffect(() => { setH(hour); setM(minute); setEditH(true); }, [visible, hour, minute]);
  const HOURS = Array.from({length:24},(_,i)=>i);
  const MINS  = [0,5,10,15,20,25,30,35,40,45,50,55];
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={ck.overlay}>
        <View style={ck.sheet}>
          <View style={ck.display}>
            <TouchableOpacity style={[ck.block, editH && ck.blockOn]} onPress={()=>setEditH(true)}>
              <Text style={[ck.bTxt, editH && ck.bTxtOn]}>{String(h).padStart(2,'0')}</Text>
            </TouchableOpacity>
            <Text style={ck.colon}>:</Text>
            <TouchableOpacity style={[ck.block, !editH && ck.blockOn]} onPress={()=>setEditH(false)}>
              <Text style={[ck.bTxt, !editH && ck.bTxtOn]}>{String(m).padStart(2,'0')}</Text>
            </TouchableOpacity>
          </View>
          <ScrollView style={{maxHeight:190}} showsVerticalScrollIndicator={false}>
            <View style={ck.grid}>
              {(editH?HOURS:MINS).map(v=>{
                const on = editH ? v===h : v===m;
                return (
                  <TouchableOpacity key={v} style={[ck.cell, on&&ck.cellOn]} onPress={()=>editH?setH(v):setM(v)}>
                    <Text style={[ck.cTxt, on&&ck.cTxtOn]}>{String(v).padStart(2,'0')}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View style={ck.actions}>
            <TouchableOpacity style={ck.cancel} onPress={onClose}><Text style={ck.cancelTxt}>Cancel</Text></TouchableOpacity>
            <TouchableOpacity style={ck.ok} onPress={()=>{onConfirm(h,m);onClose();}}><Text style={ck.okTxt}>OK</Text></TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
const ck = StyleSheet.create({
  overlay: {flex:1,backgroundColor:'rgba(0,0,0,0.5)',justifyContent:'center',padding:24},
  sheet:   {backgroundColor:'#fff',borderRadius:20,overflow:'hidden'},
  display: {flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:20,backgroundColor:'#F2F6FF',gap:8},
  block:   {backgroundColor:'#E0E9F8',borderRadius:12,paddingHorizontal:22,paddingVertical:12,minWidth:74,alignItems:'center'},
  blockOn: {backgroundColor:'#003580'},
  bTxt:    {fontSize:34,fontWeight:'900',color:'#1A2332'},
  bTxtOn:  {color:'#fff'},
  colon:   {fontSize:34,fontWeight:'900',color:'#1A2332'},
  grid:    {flexDirection:'row',flexWrap:'wrap',padding:12,gap:8,justifyContent:'center'},
  cell:    {width:52,height:44,borderRadius:10,backgroundColor:'#F0F4FA',alignItems:'center',justifyContent:'center'},
  cellOn:  {backgroundColor:'#003580'},
  cTxt:    {fontSize:15,fontWeight:'600',color:'#4A5568'},
  cTxtOn:  {color:'#fff',fontWeight:'800'},
  actions: {flexDirection:'row',borderTopWidth:1,borderTopColor:'#EEF'},
  cancel:  {flex:1,paddingVertical:16,alignItems:'center'},
  cancelTxt:{fontSize:15,fontWeight:'600',color:'#8A9BB0'},
  ok:      {flex:1,paddingVertical:16,alignItems:'center',backgroundColor:'#003580'},
  okTxt:   {fontSize:15,fontWeight:'800',color:'#fff'},
});

// ─── Calendar modal ─────────────────────────────────────────────
const CalModal= ({ visible, selected, onSelect, onClose }) => {
  const today = new Date();
  const [yr, setYr] = useState(today.getFullYear());
  const [mo, setMo] = useState(today.getMonth());
  const MN=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DN=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const first=new Date(yr,mo,1).getDay();
  const total=new Date(yr,mo+1,0).getDate();
  const cells=[...Array(first).fill(null),...Array.from({length:total},(_,i)=>i+1)];
  const isPast=(d)=>new Date(yr,mo,d)<new Date(today.getFullYear(),today.getMonth(),today.getDate());
  const isToday=(d)=>d===today.getDate()&&mo===today.getMonth()&&yr===today.getFullYear();
  const isSel=(d)=>!!(selected&&d===selected.getDate()&&mo===selected.getMonth()&&yr===selected.getFullYear());
  const prev=()=>mo===0?(setMo(11),setYr(y=>y-1)):setMo(m=>m-1);
  const next=()=>mo===11?(setMo(0),setYr(y=>y+1)):setMo(m=>m+1);
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={cal.overlay}>
        <View style={cal.sheet}>
          <View style={cal.nav}>
            <TouchableOpacity onPress={prev} hitSlop={{top:8,bottom:8,left:8,right:8}}><Text style={cal.arr}>‹</Text></TouchableOpacity>
            <Text style={cal.navTtl}>{MN[mo]} {yr}</Text>
            <TouchableOpacity onPress={next} hitSlop={{top:8,bottom:8,left:8,right:8}}><Text style={cal.arr}>›</Text></TouchableOpacity>
          </View>
          <View style={cal.dayRow}>{DN.map(d=><Text key={d} style={cal.day}>{d}</Text>)}</View>
          <View style={cal.grid}>
            {cells.map((d,i)=>(
              <TouchableOpacity key={i}
                style={[cal.cell, d&&isSel(d)&&cal.cellSel, d&&isToday(d)&&!isSel(d)&&cal.cellToday]}
                onPress={()=>{if(d&&!isPast(d)){onSelect(new Date(yr,mo,d));onClose();}}}
                disabled={!d||isPast(d)}>
                <Text style={[cal.cellTxt, d&&isSel(d)&&cal.selTxt, d&&isPast(d)&&cal.pastTxt]}>{d??''}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={cal.closeBtn} onPress={onClose}>
            <Text style={cal.closeTxt}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
const cal = StyleSheet.create({
  overlay:{flex:1,backgroundColor:'rgba(0,0,0,0.4)',justifyContent:'flex-end'},
  sheet:{backgroundColor:'#fff',borderTopLeftRadius:24,borderTopRightRadius:24,paddingBottom:34},
  nav:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:20,borderBottomWidth:1,borderBottomColor:'#F0F4FA'},
  arr:{fontSize:28,color:'#003580',fontWeight:'700'},
  navTtl:{fontSize:17,fontWeight:'800',color:'#003580'},
  dayRow:{flexDirection:'row',paddingHorizontal:12,paddingTop:12},
  day:{flex:1,textAlign:'center',fontSize:11,fontWeight:'700',color:'#8A9BB0'},
  grid:{flexDirection:'row',flexWrap:'wrap',paddingHorizontal:12,paddingBottom:8},
  cell:{width:`${100/7}%`,aspectRatio:1,alignItems:'center',justifyContent:'center'},
  cellSel:{backgroundColor:'#003580',borderRadius:100},
  cellToday:{backgroundColor:'#EBF3FF',borderRadius:100},
  cellTxt:{fontSize:15,fontWeight:'600',color:'#1A2332'},
  selTxt:{color:'#fff',fontWeight:'800'},
  pastTxt:{color:'#CCC'},
  closeBtn:{marginHorizontal:20,marginTop:8,backgroundColor:'#F0F4FF',borderRadius:12,paddingVertical:14,alignItems:'center'},
  closeTxt:{fontSize:15,fontWeight:'700',color:'#003580'},
});

// ══════════════════════════════════════════════════════════════
//  MAIN SCREEN
// ══════════════════════════════════════════════════════════════
const PostRide= () => {
  const mapRef = useRef(null);

  // ── Location permission (ask until granted) ───────────────
  const [userCoords, setUserCoords] = useState(null);

  const askPermission = useCallback(async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status === 'granted') {
      try {
        const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setUserCoords({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      } catch { /* silent fail */ }
    } else {
      Alert.alert(
        'Location Required',
        'Please allow location access so we can show your position and nearby places.',
        [
          { text: 'Ask Again',     onPress: askPermission },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ],
        { cancelable: false }
      );
    }
  }, []);

  useEffect(() => { askPermission(); }, [askPermission]);

  // ── Core state ────────────────────────────────────────────
  const [pickup,      setPickup]      = useState(null);
  const [drop,        setDrop]        = useState(null);
  const [showPickup,  setShowPickup]  = useState(false);
  const [showDrop,    setShowDrop]    = useState(false);

  const [routes,        setRoutes]        = useState([]);
  const [selRoute,      setSelRoute]      = useState(0);
  const [loadingRoutes, setLoadingRoutes] = useState(false);

  const [date,      setDate]      = useState(null);
  const [hour,      setHour]      = useState(12);
  const [minute,    setMinute]    = useState(0);
  const [showCal,   setShowCal]   = useState(false);
  const [showClock, setShowClock] = useState(false);

  const [pax,       setPax]       = useState(3);
  const [max2Back,  setMax2Back]  = useState(false);
  const [womenOnly, setWomenOnly] = useState(false);

  const [price, setPrice] = useState(260);
  const REC_MIN = 250, REC_MAX = 270;

  const [instantBook, setInstantBook] = useState(true);
  const [returnRide,  setReturnRide]  = useState(false);

  // ── Fetch routes when both pins set ──────────────────────
  useEffect(() => {
    if (!pickup || !drop) { setRoutes([]); return; }
    setLoadingRoutes(true);
    setRoutes([]);
    getRoutes(pickup.coords, drop.coords).then(rs => {
      setRoutes(rs);
      setSelRoute(0);
      setLoadingRoutes(false);
      setTimeout(() => {
        const pts = rs[0]?.points?.length ? rs[0].points : [pickup.coords, drop.coords];
        mapRef.current?.fitToCoordinates(pts, {
          edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
          animated: true,
        });
      }, 500);
    });
  }, [pickup, drop]);

  // Refit when route selection changes
  useEffect(() => {
    const pts = routes[selRoute]?.points;
    if (pts?.length) {
      mapRef.current?.fitToCoordinates(pts, {
        edgePadding: { top: 70, right: 70, bottom: 70, left: 70 },
        animated: true,
      });
    }
  }, [selRoute, routes]);

  // ── Helpers ───────────────────────────────────────────────
  const activeRoute = routes[selRoute];
  const priceStatus = price >= REC_MIN && price <= REC_MAX ? 'ok' : price < REC_MIN ? 'low' : 'high';
  const allReady    = !!(pickup && drop && date);
  const fmtDate     = (d) => d.toLocaleDateString('en-IN', { weekday:'short', day:'numeric', month:'long' });
  const fmtTime     = () => `${String(hour).padStart(2,'0')}:${String(minute).padStart(2,'0')}`;

  const initRegion = userCoords
    ? { ...userCoords, latitudeDelta: 0.15, longitudeDelta: 0.15 }
    : { latitude: 17.49, longitude: 78.39, latitudeDelta: 0.5, longitudeDelta: 0.5 };

  // ── Render ────────────────────────────────────────────────
  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* ══ STEP 1 — WHERE ══ */}
        <SH n="1" title="Where are you going?" done={!!(pickup && drop)} />

        {/* MAP */}
        <View style={s.mapWrap}>
          <MapView
            ref={mapRef}
            provider={PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            initialRegion={initRegion}
            showsUserLocation
            showsMyLocationButton={false}
            toolbarEnabled={false}
          >
            {/* Unselected routes — grey dashed */}
            {routes.map((r, i) => i !== selRoute && (
              <Polyline key={`u${i}`} coordinates={r.points} strokeWidth={3}
                strokeColor="#B0BECE" lineDashPattern={[8,6]} zIndex={1} />
            ))}
            {/* Selected route — coloured */}
            {activeRoute && (
              <Polyline key={`s${selRoute}`} coordinates={activeRoute.points}
                strokeWidth={5} strokeColor={RCOLS[selRoute % 3]} zIndex={10} />
            )}
            {pickup && (
              <Marker coordinate={pickup.coords} anchor={{ x:0.5, y:1 }} tracksViewChanges={false}>
                <View style={s.pinA}><Text style={s.pinTxt}>A</Text></View>
              </Marker>
            )}
            {drop && (
              <Marker coordinate={drop.coords} anchor={{ x:0.5, y:1 }} tracksViewChanges={false}>
                <View style={s.pinB}><Text style={s.pinTxt}>B</Text></View>
              </Marker>
            )}
          </MapView>

          {loadingRoutes && (
            <View style={s.mapOverlay}>
              <ActivityIndicator color="#0070F3" />
              <Text style={s.mapOverlayTxt}>  Finding routes…</Text>
            </View>
          )}
          {!pickup && !drop && (
            <View style={s.mapHint}>
              <Text style={s.mapHintTxt}>📍 Add pickup & drop to see route</Text>
            </View>
          )}
        </View>

        {/* Location card */}
        <View style={s.locCard}>
          <TouchableOpacity style={s.locRow} onPress={() => setShowPickup(true)} activeOpacity={0.75}>
            <View style={s.dotWrap}><View style={s.dotA} /></View>
            <View style={{ flex:1 }}>
              <Text style={s.locTag}>PICKUP</Text>
              <Text style={[s.locVal, !pickup && s.locPh]} numberOfLines={1}>
                {pickup?.name ?? 'Add pickup location'}
              </Text>
              {pickup && <Text style={s.locSub} numberOfLines={1}>{pickup.address}</Text>}
            </View>
            <Text style={s.locBtn}>{pickup ? '✎' : '+'}</Text>
          </TouchableOpacity>

          <View style={{ paddingLeft:32, height:16 }}>
            <View style={{ width:2, height:'100%', backgroundColor:'#D0DAF0' }} />
          </View>

          <TouchableOpacity style={s.locRow} onPress={() => setShowDrop(true)} activeOpacity={0.75}>
            <View style={s.dotWrap}><View style={s.dotB} /></View>
            <View style={{ flex:1 }}>
              <Text style={s.locTag}>DROP-OFF</Text>
              <Text style={[s.locVal, !drop && s.locPh]} numberOfLines={1}>
                {drop?.name ?? 'Add drop location'}
              </Text>
              {drop && <Text style={s.locSub} numberOfLines={1}>{drop.address}</Text>}
            </View>
            <Text style={s.locBtn}>{drop ? '✎' : '+'}</Text>
          </TouchableOpacity>
        </View>

        {/* Route choices */}
        {routes.length > 0 && (
          <View style={s.card}>
            <Text style={s.cardTitle}>What is your route?</Text>
            {routes.map((r, i) => (
              <TouchableOpacity
                key={i}
                style={[s.routeRow, i < routes.length-1 && s.routeDiv]}
                onPress={() => setSelRoute(i)}
                activeOpacity={0.8}
              >
                <View style={[s.radio, selRoute===i && s.radioOn]}>
                  {selRoute===i && <View style={s.radioDot}/>}
                </View>
                <View style={{ flex:1 }}>
                  <Text style={[s.rLabel, selRoute===i && { color: RCOLS[i%3] }]}>{r.label}</Text>
                  <Text style={s.rSub}>{r.sublabel}</Text>
                </View>
                {selRoute===i && <View style={[s.rDot, { backgroundColor: RCOLS[i%3] }]}/>}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Route error */}
        {pickup && drop && !loadingRoutes && routes.length === 0 && (
          <View style={[s.card, { alignItems:'center' }]}>
            <Text style={{ color:'#E05252', fontWeight:'600', textAlign:'center', lineHeight:22 }}>
              ⚠ Could not load routes.{'\n'}Check your API key or network.
            </Text>
            <TouchableOpacity
              style={{ marginTop:12, backgroundColor:'#003580', borderRadius:10, paddingHorizontal:20, paddingVertical:10 }}
              onPress={() => {
                if (!pickup || !drop) return;
                setLoadingRoutes(true);
                getRoutes(pickup.coords, drop.coords).then(rs => { setRoutes(rs); setLoadingRoutes(false); });
              }}
            >
              <Text style={{ color:'#fff', fontWeight:'700' }}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ══ STEP 2 — WHEN ══ */}
        <SH n="2" title="When are you going?" done={!!date} />
        <View style={s.card}>
          <TouchableOpacity style={s.inRow} onPress={() => setShowCal(true)} activeOpacity={0.8}>
            <Text style={s.inIcon}>📅</Text>
            <View style={{ flex:1 }}>
              <Text style={s.inTag}>DATE</Text>
              <Text style={[s.inVal, !date && { color:'#AAB8CC' }]}>{date ? fmtDate(date) : 'Select date'}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <View style={s.div}/>
          <TouchableOpacity style={s.inRow} onPress={() => setShowClock(true)} activeOpacity={0.8}>
            <Text style={s.inIcon}>🕐</Text>
            <View style={{ flex:1 }}>
              <Text style={s.inTag}>PICKUP TIME</Text>
              <Text style={s.inVal}>{fmtTime()}</Text>
            </View>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ══ STEP 3 — PASSENGERS ══ */}
        <SH n="3" title="Passengers" done />
        <View style={s.card}>
          <Text style={s.cardSubtitle}>So how many passengers can you take?</Text>
          <View style={s.counter}>
            <TouchableOpacity style={[s.cBtn, pax<=1&&s.cBtnOff]} onPress={()=>setPax(p=>Math.max(1,p-1))} disabled={pax<=1}>
              <Text style={[s.cBtnTxt, pax<=1&&{color:'#CCC'}]}>−</Text>
            </TouchableOpacity>
            <Text style={s.cVal}>{pax}</Text>
            <TouchableOpacity style={[s.cBtn, pax>=7&&s.cBtnOff]} onPress={()=>setPax(p=>Math.min(7,p+1))} disabled={pax>=7}>
              <Text style={[s.cBtnTxt, pax>=7&&{color:'#CCC'}]}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={s.div}/>
          <Text style={[s.cardTitle,{marginTop:12,marginBottom:10}]}>Passenger options</Text>
          <TouchableOpacity style={s.optRow} onPress={()=>setMax2Back(v=>!v)} activeOpacity={0.8}>
            <View style={[s.chk, max2Back&&s.chkOn]}>{max2Back&&<Text style={s.chkTick}>✓</Text>}</View>
            <View style={{flex:1}}>
              <Text style={s.optLabel}>Max. 2 in the back</Text>
              <Text style={s.optSub}>Think comfort, keep the middle seat empty</Text>
            </View>
            <Text style={s.optIcon}>👥</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.optRow} onPress={()=>setWomenOnly(v=>!v)} activeOpacity={0.8}>
            <View style={[s.chk, womenOnly&&s.chkOn]}>{womenOnly&&<Text style={s.chkTick}>✓</Text>}</View>
            <View style={{flex:1}}>
              <Text style={s.optLabel}>Women Only</Text>
              <Text style={s.optSub}>Make your ride only visible to women</Text>
            </View>
            <Text style={s.optIcon}>♀</Text>
          </TouchableOpacity>
        </View>

        {/* ══ STEP 4 — PRICE ══ */}
        <SH n="4" title="Set your price per seat" done />
        <View style={s.card}>
          <View style={s.counter}>
            <TouchableOpacity style={[s.cBtn, price<=50&&s.cBtnOff]} onPress={()=>setPrice(p=>Math.max(50,p-10))} disabled={price<=50}>
              <Text style={[s.cBtnTxt, price<=50&&{color:'#CCC'}]}>−</Text>
            </TouchableOpacity>
            <Text style={[s.priceVal,
              priceStatus==='ok'  ?{color:'#1A7A4A'}
              :priceStatus==='low'?{color:'#E05252'}
              :{color:'#D4800A'}]}>
              ₹ {price}
            </Text>
            <TouchableOpacity style={s.cBtn} onPress={()=>setPrice(p=>p+10)}>
              <Text style={s.cBtnTxt}>+</Text>
            </TouchableOpacity>
          </View>
          <View style={{alignItems:'center',marginTop:12,gap:8}}>
            <View style={[s.recPill, priceStatus==='ok'?{backgroundColor:'#1A7A4A'}:{backgroundColor:'#E8EDF5'}]}>
              <Text style={[s.recTxt, priceStatus!=='ok'&&{color:'#8A9BB0'}]}>
                Recommended: ₹{REC_MIN} – ₹{REC_MAX}
              </Text>
            </View>
            {priceStatus==='ok'  &&<Text style={{color:'#1A7A4A',fontWeight:'600',fontSize:13}}>✨ Perfect price! You'll get passengers in no time.</Text>}
            {priceStatus==='low' &&<Text style={{color:'#E05252',fontWeight:'600',fontSize:13}}>↑ Consider raising the price a bit.</Text>}
            {priceStatus==='high'&&<Text style={{color:'#D4800A',fontWeight:'600',fontSize:13}}>↓ A slightly lower price gets more passengers.</Text>}
          </View>
          {activeRoute && (
            <View style={s.routeHint}>
              <Text style={s.routeHintTxt}>
                🗺  {activeRoute.sublabel.split('·')[0].trim()} · {activeRoute.label.split('·')[0].trim()}
              </Text>
            </View>
          )}
        </View>

        {/* ══ STEP 5 — BOOKING ══ */}
        <SH n="5" title="Booking type" done />
        <View style={s.card}>
          <View style={s.bookBanner}>
            <Text style={{fontSize:28}}>⚡</Text>
            <View style={{flex:1,marginLeft:12}}>
              <Text style={s.bookTitle}>Enable Instant Booking for your passengers</Text>
              <Text style={s.bookPt}>🔔  No need to review every request before it expires</Text>
              <Text style={s.bookPt}>⚡  Get more passengers — they prefer instant answers</Text>
            </View>
          </View>
          <TouchableOpacity style={s.bookRow} onPress={()=>setInstantBook(true)} activeOpacity={0.8}>
            <View style={[s.radio, instantBook&&s.radioOn]}>{instantBook&&<View style={s.radioDot}/>}</View>
            <Text style={[s.bookLabel, instantBook&&s.bookLabelOn]}>Enable Instant Booking</Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <View style={s.div}/>
          <TouchableOpacity style={s.bookRow} onPress={()=>setInstantBook(false)} activeOpacity={0.8}>
            <View style={[s.radio, !instantBook&&s.radioOn]}>{!instantBook&&<View style={s.radioDot}/>}</View>
            <Text style={s.bookLabel}>Review every request before it expires</Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ══ STEP 6 — RETURN ══ */}
        <SH n="6" title="Return ride?" />
        <View style={s.card}>
          <View style={{alignItems:'center',paddingVertical:16}}>
            <Text style={{fontSize:44,marginBottom:10}}>🔄</Text>
            <Text style={s.returnTitle}>Coming back as well?{'\n'}Publish your return ride now!</Text>
          </View>
          <TouchableOpacity style={s.bookRow} onPress={()=>setReturnRide(true)} activeOpacity={0.8}>
            <View style={[s.radio, returnRide&&s.radioOn]}>{returnRide&&<View style={s.radioDot}/>}</View>
            <Text style={[s.bookLabel, returnRide&&s.bookLabelOn]}>Yes, sure!</Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
          <View style={s.div}/>
          <TouchableOpacity style={s.bookRow} onPress={()=>setReturnRide(false)} activeOpacity={0.8}>
            <View style={[s.radio, !returnRide&&s.radioOn]}>{!returnRide&&<View style={s.radioDot}/>}</View>
            <Text style={s.bookLabel}>No, thanks</Text>
            <Text style={s.chevron}>›</Text>
          </TouchableOpacity>
        </View>

        {/* ══ PUBLISH ══ */}
        <View style={s.pubSection}>
          {!allReady && (
            <Text style={s.pubHint}>
              {!pickup ? '⚠  Add pickup location' : !drop ? '⚠  Add drop location' : '⚠  Select a travel date'}
            </Text>
          )}
          <TouchableOpacity
            style={[s.pubBtn, !allReady && s.pubBtnOff]}
            activeOpacity={allReady ? 0.85 : 1}
            onPress={() => {
              if (!allReady) return;
              Alert.alert(
                '🎉 Ride Published!',
                `${pickup?.name} → ${drop?.name}\n`
                + (activeRoute ? `${activeRoute.label}\n${activeRoute.sublabel}` : '')
              );
            }}
          >
            <Text style={s.pubBtnTxt}>Publish Ride  →</Text>
          </TouchableOpacity>
        </View>
        <View style={{ height:50 }} />
      </ScrollView>

      {/* ── Modals ── */}
      <LocModal visible={showPickup} title="Pickup"    userCoords={userCoords} onSelect={p=>{setPickup(p);setShowPickup(false);}} onClose={()=>setShowPickup(false)} />
      <LocModal visible={showDrop}   title="Drop-off"  userCoords={userCoords} onSelect={p=>{setDrop(p);  setShowDrop(false);  }} onClose={()=>setShowDrop(false)}   />
      <CalModal   visible={showCal}   selected={date}  onSelect={setDate}  onClose={()=>setShowCal(false)}   />
      <ClockModal visible={showClock} hour={hour} minute={minute} onConfirm={(h,m)=>{setHour(h);setMinute(m);}} onClose={()=>setShowClock(false)} />
    </SafeAreaView>
  );
};

export default PostRide;

// ─── Styles ────────────────────────────────────────────────────
const BLUE='#003580', ACCENT='#0070F3', GREEN='#1A7A4A', BORDER='#E4E9F2';
const s = StyleSheet.create({
  safe:    {flex:1,backgroundColor:'#F2F5FB',marginTop:50},
  topBar:  {flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:14,backgroundColor:'#fff',borderBottomWidth:1,borderBottomColor:BORDER},
  backBtn: {width:40,height:40,alignItems:'center',justifyContent:'center'},
  backArrow:{fontSize:22,color:ACCENT,fontWeight:'700'},
  topTitle:{flex:1,textAlign:'center',fontSize:17,fontWeight:'800',color:BLUE},

  mapWrap: {marginHorizontal:16,height:230,borderRadius:16,overflow:'hidden',backgroundColor:'#E8F0E8'},
  mapOverlay:{position:'absolute',top:0,left:0,right:0,bottom:0,backgroundColor:'rgba(255,255,255,0.7)',alignItems:'center',justifyContent:'center',flexDirection:'row'},
  mapOverlayTxt:{fontSize:13,fontWeight:'600',color:ACCENT},
  mapHint: {position:'absolute',bottom:10,left:0,right:0,alignItems:'center'},
  mapHintTxt:{backgroundColor:'rgba(255,255,255,0.92)',paddingHorizontal:14,paddingVertical:7,borderRadius:20,fontSize:12,fontWeight:'600',color:'#4A5568'},

  pinA:{width:30,height:30,borderRadius:15,backgroundColor:BLUE,alignItems:'center',justifyContent:'center',borderWidth:2.5,borderColor:'#fff',elevation:5},
  pinB:{width:30,height:30,borderRadius:15,backgroundColor:GREEN,alignItems:'center',justifyContent:'center',borderWidth:2.5,borderColor:'#fff',elevation:5},
  pinTxt:{color:'#fff',fontSize:13,fontWeight:'900'},

  locCard:{backgroundColor:'#fff',marginHorizontal:16,marginTop:4,borderRadius:16,overflow:'hidden',shadowColor:'#000',shadowOpacity:0.06,shadowRadius:8,elevation:3},
  locRow: {flexDirection:'row',alignItems:'center',paddingHorizontal:16,paddingVertical:14},
  dotWrap:{width:28,alignItems:'center',marginRight:10},
  dotA:   {width:13,height:13,borderRadius:7,backgroundColor:BLUE,borderWidth:2,borderColor:'#C8D5F0'},
  dotB:   {width:13,height:13,borderRadius:7,backgroundColor:GREEN,borderWidth:2,borderColor:'#B8E0C8'},
  locTag: {fontSize:10,fontWeight:'800',color:'#8A9BB0',letterSpacing:0.8,marginBottom:2},
  locVal: {fontSize:15,fontWeight:'700',color:BLUE},
  locPh:  {color:'#AAB8CC',fontWeight:'500'},
  locSub: {fontSize:11,color:'#8A9BB0',marginTop:1},
  locBtn: {fontSize:20,color:ACCENT,paddingLeft:8},

  card:       {backgroundColor:'#fff',marginHorizontal:16,marginVertical:4,borderRadius:16,padding:16,shadowColor:'#000',shadowOpacity:0.04,shadowRadius:6,elevation:2},
  cardTitle:  {fontSize:14,fontWeight:'800',color:BLUE,marginBottom:12},
  cardSubtitle:{fontSize:15,fontWeight:'700',color:'#1A2332',marginBottom:14,textAlign:'center'},
  div:        {height:1,backgroundColor:'#F0F4FA',marginVertical:4},
  chevron:    {fontSize:22,color:'#C5CDD8'},

  routeRow:   {flexDirection:'row',alignItems:'center',paddingVertical:14},
  routeDiv:   {borderBottomWidth:1,borderBottomColor:'#F0F4FA'},
  rLabel:     {fontSize:14,fontWeight:'700',color:'#1A2332'},
  rSub:       {fontSize:12,color:'#8A9BB0',marginTop:2},
  rDot:       {width:10,height:10,borderRadius:5},
  radio:      {width:20,height:20,borderRadius:10,borderWidth:2,borderColor:'#C5CDD8',marginRight:12,alignItems:'center',justifyContent:'center'},
  radioOn:    {borderColor:BLUE},
  radioDot:   {width:10,height:10,borderRadius:5,backgroundColor:BLUE},

  inRow:  {flexDirection:'row',alignItems:'center',paddingVertical:12},
  inIcon: {fontSize:20,marginRight:12},
  inTag:  {fontSize:10,fontWeight:'800',color:'#8A9BB0',letterSpacing:0.6,marginBottom:2},
  inVal:  {fontSize:15,fontWeight:'700',color:'#1A2332'},

  counter:{flexDirection:'row',alignItems:'center',justifyContent:'center',paddingVertical:6,gap:28},
  cBtn:   {width:44,height:44,borderRadius:22,borderWidth:2,borderColor:ACCENT,alignItems:'center',justifyContent:'center'},
  cBtnOff:{borderColor:'#DDE3EE'},
  cBtnTxt:{fontSize:24,color:ACCENT,fontWeight:'700',lineHeight:28},
  cVal:   {fontSize:52,fontWeight:'900',color:BLUE,minWidth:72,textAlign:'center'},

  priceVal:{fontSize:44,fontWeight:'900',minWidth:130,textAlign:'center'},
  recPill: {paddingHorizontal:14,paddingVertical:6,borderRadius:20},
  recTxt:  {fontSize:13,fontWeight:'700',color:'#fff'},
  routeHint:   {marginTop:14,backgroundColor:'#F0F6FF',borderRadius:10,padding:10},
  routeHintTxt:{fontSize:12,color:ACCENT,fontWeight:'600',textAlign:'center'},

  optRow: {flexDirection:'row',alignItems:'center',paddingVertical:12},
  chk:    {width:20,height:20,borderRadius:4,borderWidth:2,borderColor:'#C5CDD8',marginRight:12,alignItems:'center',justifyContent:'center'},
  chkOn:  {borderColor:BLUE,backgroundColor:BLUE},
  chkTick:{color:'#fff',fontSize:12,fontWeight:'800'},
  optLabel:{fontSize:14,fontWeight:'700',color:'#1A2332'},
  optSub:  {fontSize:12,color:'#8A9BB0',marginTop:1},
  optIcon: {fontSize:20,marginLeft:8},

  bookBanner:{flexDirection:'row',alignItems:'flex-start',backgroundColor:'#EBF3FF',borderRadius:12,padding:14,marginBottom:14},
  bookTitle: {fontSize:14,fontWeight:'800',color:BLUE,marginBottom:6},
  bookPt:    {fontSize:12,color:'#5A7AB0',marginTop:3},
  bookRow:   {flexDirection:'row',alignItems:'center',paddingVertical:14},
  bookLabel: {flex:1,fontSize:14,fontWeight:'600',color:'#4A5568'},
  bookLabelOn:{color:ACCENT,fontWeight:'700'},

  returnTitle:{fontSize:16,fontWeight:'800',color:BLUE,textAlign:'center',lineHeight:26},

  pubSection:{margin:16,marginTop:8},
  pubHint:   {textAlign:'center',fontSize:13,color:'#E05252',fontWeight:'600',marginBottom:10},
  pubBtn:    {backgroundColor:BLUE,borderRadius:16,paddingVertical:18,alignItems:'center',shadowColor:BLUE,shadowOpacity:0.35,shadowRadius:12,elevation:6},
  pubBtnOff: {backgroundColor:'#C5CDD8',shadowOpacity:0},
  pubBtnTxt: {color:'#fff',fontSize:16,fontWeight:'900',letterSpacing:0.4},
});