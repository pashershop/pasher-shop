import React, { useState, useMemo } from 'react';
import {
  X,
  MapPin,
  Search,
  Check,
  ChevronRight,
  Globe,
  Building2,
  Navigation,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import {
  BANGLADESH_DIVISIONS,
  Division,
  District,
  getAllSearchableLocations,
  LocationSearchResult,
} from '../data/bangladeshLocations';

interface LocationModalProps {
  isOpen: boolean;
  currentArea: string;
  onDetectLocation?: () => void;
  onSelectArea: (areaName: string, coordinates?: { lat: number; lng: number }) => void;
  onClose: () => void;
}

export const LocationModal: React.FC<LocationModalProps> = ({
  isOpen,
  currentArea,
  onDetectLocation,
  onSelectArea,
  onClose,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDivision, setSelectedDivision] = useState<Division | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [activeTab, setActiveTab] = useState<'browse' | 'divisions' | 'districts' | 'upazilas'>('divisions');

  // Pre-load searchable dataset
  const allLocations = useMemo(() => getAllSearchableLocations(), []);

  // Filter search results
  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    return allLocations
      .filter((loc) => loc.nameBn.toLowerCase().includes(q))
      .slice(0, 30);
  }, [searchQuery, allLocations]);

  // Popular quick picks
  const POPULAR_LOCATIONS = [
    { name: 'সকল এলাকা (সমগ্র বাংলাদেশ)', lat: 23.8103, lng: 90.4125 },
    { name: 'ধানমন্ডি, ঢাকা', lat: 23.7465, lng: 90.3760 },
    { name: 'মিরপুর, ঢাকা', lat: 23.8071, lng: 90.3686 },
    { name: 'উত্তরা, ঢাকা', lat: 23.8732, lng: 90.3984 },
    { name: 'পাঁচলাইশ, চট্টগ্রাম', lat: 22.3654, lng: 91.8285 },
    { name: 'সিলেট সদর, সিলেট', lat: 24.8949, lng: 91.8687 },
    { name: 'বোয়ালিয়া, রাজশাহী', lat: 24.3745, lng: 88.6042 },
    { name: 'খুলনা সদর, খুলনা', lat: 22.8456, lng: 89.5403 },
  ];

  if (!isOpen) return null;

  const handlePickLocation = (name: string, coords?: { lat: number; lng: number }) => {
    onSelectArea(name, coords);
    onClose();
  };

  const handleSelectDivision = (div: Division) => {
    setSelectedDivision(div);
    setSelectedDistrict(null);
    setActiveTab('districts');
  };

  const handleSelectDistrict = (dist: District) => {
    setSelectedDistrict(dist);
    setActiveTab('upazilas');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 relative animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0B4A8A]/10 text-[#0B4A8A] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5 text-[#FF7900]" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-[#171717]">
                আপনার অবস্থান বা এলাকা নির্বাচন করুন
              </h3>
              <p className="text-xs text-slate-500">
                বাংলাদেশের ৮টি বিভাগ, ৬৪টি জেলা ও সকল উপজেলার মধ্যে খুঁজুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors border border-slate-200 shadow-xs"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Input Bar */}
        <div className="p-4 sm:p-5 pb-3 border-b border-slate-100 shrink-0 bg-white">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="যেকোনো বিভাগ, জেলা বা উপজেলা লিখে সার্চ করুন (যেমন: মিরপুর, বগুড়া, সিলেট...)"
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#FF7900]/40 focus:border-[#FF7900] bg-slate-50/60 placeholder:text-slate-400 font-medium"
              autoFocus
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Automatic Geolocation Detection Button */}
          {onDetectLocation && (
            <button
              type="button"
              onClick={() => {
                onDetectLocation();
                onClose();
              }}
              className="w-full mt-3 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#0B4A8A]/10 to-[#FF7900]/10 hover:from-[#0B4A8A]/15 hover:to-[#FF7900]/15 border border-[#0B4A8A]/25 flex items-center justify-between text-xs font-bold text-[#0B4A8A] transition-all cursor-pointer shadow-2xs"
            >
              <div className="flex items-center gap-2">
                <Navigation className="w-4 h-4 text-[#FF7900] animate-pulse" />
                <span>আমার বর্তমান অবস্থান অটোমেটিক শনাক্ত করুন (Live GPS)</span>
              </div>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-slate-200">
                স্বয়ংক্রিয়
              </span>
            </button>
          )}

          {/* Quick Popular Picks Pills */}
          {!searchQuery && (
            <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
              <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 shrink-0">
                <Sparkles className="w-3 h-3 text-[#FF7900]" /> দ্রুত নির্বাচন:
              </span>
              {POPULAR_LOCATIONS.map((pop, idx) => (
                <button
                  key={idx}
                  onClick={() => handlePickLocation(pop.name, { lat: pop.lat, lng: pop.lng })}
                  className={`shrink-0 px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors ${
                    currentArea === pop.name
                      ? 'bg-[#0B4A8A] text-white border-[#0B4A8A]'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  {pop.name.split(',')[0]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Body Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">
          {searchQuery ? (
            /* Live Search Results View */
            <div>
              <div className="text-xs font-bold text-slate-500 mb-3 flex items-center justify-between">
                <span>সার্চ ফলাফল ({searchResults.length})</span>
                {searchResults.length === 0 && (
                  <span className="text-amber-600">কোনো অবস্থান পাওয়া যায়নি</span>
                )}
              </div>

              {searchResults.length === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <Search className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-700">"{searchQuery}" এর জন্য কিছু পাওয়া যায়নি</p>
                  <p className="text-xs text-slate-400 mt-1">দয়া করে বাংলা বানান অথবা জেলা/বিভাগের নাম দিয়ে খুঁজুন</p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {searchResults.map((item) => {
                    const isSelected = currentArea.includes(item.nameBn) || currentArea === item.nameBn;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handlePickLocation(item.nameBn, { lat: item.lat, lng: item.lng })}
                        className={`w-full p-3 rounded-xl text-left text-xs sm:text-sm font-medium flex items-center justify-between transition-colors border ${
                          isSelected
                            ? 'bg-[#0B4A8A]/10 border-[#0B4A8A] text-[#0B4A8A]'
                            : 'bg-slate-50 hover:bg-slate-100/90 border-slate-100 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className={`w-4 h-4 shrink-0 ${isSelected ? 'text-[#FF7900]' : 'text-slate-400'}`} />
                          <div>
                            <span className="font-semibold text-slate-900">{item.nameBn}</span>
                            {item.parentNameBn && (
                              <span className="block text-[11px] text-slate-400">{item.parentNameBn}</span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              item.type === 'division'
                                ? 'bg-blue-100 text-[#0B4A8A]'
                                : item.type === 'district'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            {item.typeLabelBn}
                          </span>
                          {isSelected && <Check className="w-4 h-4 text-[#0B4A8A]" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            /* Hierarchical Step-by-Step Drilldown View */
            <div>
              {/* Stepper Breadcrumb Header */}
              <div className="mb-4 flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold flex-wrap">
                  <button
                    onClick={() => {
                      setActiveTab('divisions');
                      setSelectedDivision(null);
                      setSelectedDistrict(null);
                    }}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      activeTab === 'divisions'
                        ? 'bg-[#0B4A8A] text-white'
                        : 'text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    বিভাগ (৮)
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                  <button
                    onClick={() => {
                      if (selectedDivision) setActiveTab('districts');
                    }}
                    disabled={!selectedDivision}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      activeTab === 'districts'
                        ? 'bg-[#0B4A8A] text-white'
                        : selectedDivision
                        ? 'text-slate-700 hover:bg-slate-200'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedDivision ? selectedDivision.nameBn : 'জেলা (৬৪)'}
                  </button>

                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />

                  <button
                    onClick={() => {
                      if (selectedDistrict) setActiveTab('upazilas');
                    }}
                    disabled={!selectedDistrict}
                    className={`px-2 py-1 rounded-md transition-colors ${
                      activeTab === 'upazilas'
                        ? 'bg-[#0B4A8A] text-white'
                        : selectedDistrict
                        ? 'text-slate-700 hover:bg-slate-200'
                        : 'text-slate-400 cursor-not-allowed'
                    }`}
                  >
                    {selectedDistrict ? `${selectedDistrict.nameBn} উপজেলাসমূহ` : 'উপজেলা / থানা'}
                  </button>
                </div>

                {activeTab !== 'divisions' && (
                  <button
                    onClick={() => {
                      if (activeTab === 'upazilas') {
                        setActiveTab('districts');
                      } else {
                        setActiveTab('divisions');
                      }
                    }}
                    className="flex items-center gap-1 text-xs text-[#0B4A8A] hover:underline font-bold"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" /> পেছনে যান
                  </button>
                )}
              </div>

              {/* View 1: 8 Divisions */}
              {activeTab === 'divisions' && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-bold text-slate-500">
                      বিভাগ বেছে নিন অথবা সমগ্র বিভাগ নির্বাচন করুন:
                    </p>
                    <button
                      onClick={() => handlePickLocation('সকল এলাকা (সমগ্র বাংলাদেশ)', { lat: 23.8103, lng: 90.4125 })}
                      className="text-xs font-bold text-[#FF7900] hover:underline flex items-center gap-1"
                    >
                      <Globe className="w-3.5 h-3.5" /> সমগ্র বাংলাদেশ
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {BANGLADESH_DIVISIONS.map((div) => {
                      const isSelected = currentArea === div.nameBn;
                      return (
                        <div
                          key={div.id}
                          className="flex items-center justify-between p-3.5 rounded-xl border border-slate-200 hover:border-[#0B4A8A]/50 bg-white hover:bg-slate-50 transition-all shadow-2xs group"
                        >
                          <button
                            onClick={() => handleSelectDivision(div)}
                            className="flex-1 text-left flex items-center gap-3"
                          >
                            <div className="w-9 h-9 rounded-lg bg-[#0B4A8A]/5 text-[#0B4A8A] group-hover:bg-[#0B4A8A] group-hover:text-white flex items-center justify-center transition-colors shrink-0">
                              <Building2 className="w-4 h-4" />
                            </div>
                            <div>
                              <div className="font-bold text-sm text-slate-800 group-hover:text-[#0B4A8A]">
                                {div.nameBn}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                {div.districts.length}টি জেলা · {div.nameEn}
                              </div>
                            </div>
                          </button>

                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handlePickLocation(div.nameBn, { lat: div.lat, lng: div.lng })}
                              className="px-2 py-1 text-[11px] font-bold rounded text-slate-500 hover:text-[#0B4A8A] hover:bg-slate-100"
                              title={`${div.nameBn} নির্বাচন করুন`}
                            >
                              বাছাই
                            </button>
                            <button
                              onClick={() => handleSelectDivision(div)}
                              className="p-1 rounded-lg text-slate-400 hover:text-[#0B4A8A]"
                              title="জেলাগুলো দেখুন"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 2: Districts in Division */}
              {activeTab === 'districts' && selectedDivision && (
                <div>
                  <div className="flex items-center justify-between mb-3 bg-blue-50/80 p-3 rounded-xl border border-blue-100">
                    <div>
                      <span className="text-xs font-bold text-[#0B4A8A] block">
                        {selectedDivision.nameBn} এর জেলাসমূহ ({selectedDivision.districts.length}টি)
                      </span>
                      <span className="text-[11px] text-slate-500">
                        যেকোনো জেলায় ক্লিক করে তার উপজেলাগুলো দেখুন
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handlePickLocation(selectedDivision.nameBn, {
                          lat: selectedDivision.lat,
                          lng: selectedDivision.lng,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-bold bg-[#0B4A8A] text-white rounded-lg hover:bg-[#093a6d] transition-colors shrink-0"
                    >
                      সমগ্র বিভাগ নির্বাচন করুন
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedDivision.districts.map((dist) => {
                      const isSelected = currentArea.includes(dist.nameBn);
                      return (
                        <div
                          key={dist.id}
                          className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-[#FF7900] bg-white hover:bg-slate-50 transition-colors shadow-2xs group"
                        >
                          <button
                            onClick={() => handleSelectDistrict(dist)}
                            className="flex-1 text-left flex items-center gap-2.5"
                          >
                            <MapPin className="w-4 h-4 text-[#FF7900] shrink-0" />
                            <div>
                              <span className="font-bold text-sm text-slate-800 group-hover:text-[#FF7900]">
                                {dist.nameBn} জেলা
                              </span>
                              <span className="block text-[11px] text-slate-400">
                                {dist.upazilas.length}টি উপজেলা/থানা · {dist.nameEn}
                              </span>
                            </div>
                          </button>

                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() =>
                                handlePickLocation(`${dist.nameBn}, ${selectedDivision.nameBn}`, {
                                  lat: dist.lat,
                                  lng: dist.lng,
                                })
                              }
                              className="px-2 py-1 text-[11px] font-bold rounded bg-slate-100 text-slate-700 hover:bg-[#0B4A8A] hover:text-white transition-colors"
                            >
                              বাছাই
                            </button>
                            <button
                              onClick={() => handleSelectDistrict(dist)}
                              className="p-1 rounded text-slate-400 hover:text-slate-700"
                              title="উপজেলাসমূহ দেখুন"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* View 3: Upazilas in District */}
              {activeTab === 'upazilas' && selectedDistrict && selectedDivision && (
                <div>
                  <div className="flex items-center justify-between mb-3 bg-amber-50/80 p-3 rounded-xl border border-amber-200/60">
                    <div>
                      <span className="text-xs font-bold text-amber-900 block">
                        {selectedDistrict.nameBn} জেলা &gt; উপজেলা / থানাসমূহ ({selectedDistrict.upazilas.length}টি)
                      </span>
                      <span className="text-[11px] text-amber-700">
                        আপনার নির্দিষ্ট থানা বা উপজেলা বেছে নিন
                      </span>
                    </div>

                    <button
                      onClick={() =>
                        handlePickLocation(`${selectedDistrict.nameBn}, ${selectedDivision.nameBn}`, {
                          lat: selectedDistrict.lat,
                          lng: selectedDistrict.lng,
                        })
                      }
                      className="px-3 py-1.5 text-xs font-bold bg-[#FF7900] text-white rounded-lg hover:bg-[#e06b00] transition-colors shrink-0"
                    >
                      সমগ্র {selectedDistrict.nameBn} জেলা
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {selectedDistrict.upazilas.map((upz, idx) => {
                      const fullName = `${upz}, ${selectedDistrict.nameBn}`;
                      const isSelected = currentArea === fullName || currentArea.startsWith(upz);
                      return (
                        <button
                          key={idx}
                          onClick={() =>
                            handlePickLocation(fullName, {
                              lat: selectedDistrict.lat,
                              lng: selectedDistrict.lng,
                            })
                          }
                          className={`p-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between transition-all border ${
                            isSelected
                              ? 'bg-[#0B4A8A] text-white border-[#0B4A8A] shadow-xs'
                              : 'bg-slate-50 hover:bg-slate-100 text-slate-800 border-slate-200/80 hover:border-slate-300'
                          }`}
                        >
                          <div className="truncate flex items-center gap-1.5">
                            <Navigation className={`w-3 h-3 shrink-0 ${isSelected ? 'text-[#FF7900]' : 'text-slate-400'}`} />
                            <span className="truncate">{upz}</span>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-600">বর্তমান এলাকা:</span>
            <span className="font-bold text-[#0B4A8A] bg-white px-2.5 py-1 rounded-md border border-slate-200">
              {currentArea}
            </span>
          </div>

          <button
            onClick={() => handlePickLocation('সকল এলাকা (সমগ্র বাংলাদেশ)', { lat: 23.8103, lng: 90.4125 })}
            className="font-bold text-[#FF7900] hover:underline"
          >
            রিসেট (সকল এলাকা)
          </button>
        </div>
      </div>
    </div>
  );
};
