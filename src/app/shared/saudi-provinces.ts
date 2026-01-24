/**
 * Complete Saudi Arabia Provinces and Districts Data
 * Software: Rajee
 */

export interface District {
  key: string;
  en: string;
  ar: string;
}

export interface Province {
  key: string;
  en: string;
  ar: string;
  districts: District[];
}

export const SAUDI_PROVINCES: Province[] = [
  {
    key: 'riyadh',
    en: 'Riyadh Region',
    ar: 'منطقة الرياض',
    districts: [
      { key: 'riyadh_city', en: 'Riyadh', ar: 'الرياض' },
      { key: 'diriyah', en: 'Diriyah', ar: 'الدرعية' },
      { key: 'kharj', en: 'Al Kharj', ar: 'الخرج' },
      { key: 'dawadmi', en: 'Dawadmi', ar: 'الدوادمي' },
      { key: 'majmaah', en: 'Al Majmaah', ar: 'المجمعة' },
      { key: 'quwaiiyah', en: 'Al Quwaiiyah', ar: 'القويعية' },
      { key: 'wadi_dawasir', en: 'Wadi ad-Dawasir', ar: 'وادي الدواسر' },
      { key: 'aflaj', en: 'Al Aflaj', ar: 'الأفلاج' },
      { key: 'zulfi', en: 'Zulfi', ar: 'الزلفي' },
      { key: 'shaqra', en: 'Shaqra', ar: 'شقراء' },
      { key: 'hotat_bani_tamim', en: 'Hotat Bani Tamim', ar: 'حوطة بني تميم' },
      { key: 'afif', en: 'Afif', ar: 'عفيف' },
      { key: 'sulayil', en: 'As Sulayyil', ar: 'السليل' },
      { key: 'dharma', en: 'Dharma', ar: 'ضرما' },
      { key: 'muzahmiya', en: 'Al Muzahmiya', ar: 'المزاحمية' },
      { key: 'rumah', en: 'Rumah', ar: 'رماح' },
      { key: 'thadiq', en: 'Thadiq', ar: 'ثادق' },
      { key: 'hariq', en: 'Al Hariq', ar: 'الحريق' },
      { key: 'huraymila', en: 'Huraymila', ar: 'حريملاء' },
      { key: 'ghat', en: 'Al Ghat', ar: 'الغاط' },
      { key: 'marat', en: 'Marat', ar: 'مرات' },
    ]
  },
  {
    key: 'makkah',
    en: 'Makkah Region',
    ar: 'منطقة مكة المكرمة',
    districts: [
      { key: 'makkah_city', en: 'Makkah', ar: 'مكة المكرمة' },
      { key: 'jeddah', en: 'Jeddah', ar: 'جدة' },
      { key: 'taif', en: 'Taif', ar: 'الطائف' },
      { key: 'qunfudhah', en: 'Al Qunfudhah', ar: 'القنفذة' },
      { key: 'lith', en: 'Al Lith', ar: 'الليث' },
      { key: 'rabigh', en: 'Rabigh', ar: 'رابغ' },
      { key: 'jumum', en: 'Al Jumum', ar: 'الجموم' },
      { key: 'khulays', en: 'Khulays', ar: 'خليص' },
      { key: 'kamil', en: 'Al Kamil', ar: 'الكامل' },
      { key: 'khurmah', en: 'Al Khurmah', ar: 'الخرمة' },
      { key: 'ranyah', en: 'Ranyah', ar: 'رنية' },
      { key: 'turbah', en: 'Turbah', ar: 'تربة' },
      { key: 'muwayh', en: 'Al Muwayh', ar: 'الموية' },
      { key: 'madinah_munawwarah', en: 'Al Madinah', ar: 'المدينة المنورة' },
      { key: 'adham', en: 'Adham', ar: 'أضم' },
      { key: 'bahrah', en: 'Bahrah', ar: 'بحرة' },
    ]
  },
  {
    key: 'madinah',
    en: 'Madinah Region',
    ar: 'منطقة المدينة المنورة',
    districts: [
      { key: 'madinah_city', en: 'Madinah', ar: 'المدينة المنورة' },
      { key: 'yanbu', en: 'Yanbu', ar: 'ينبع' },
      { key: 'ula', en: 'Al Ula', ar: 'العلا' },
      { key: 'mahd_dhahab', en: 'Mahd adh Dhahab', ar: 'مهد الذهب' },
      { key: 'badr', en: 'Badr', ar: 'بدر' },
      { key: 'khaybar', en: 'Khaybar', ar: 'خيبر' },
      { key: 'hinakiyah', en: 'Al Hinakiyah', ar: 'الحناكية' },
      { key: 'wajh', en: 'Al Wajh', ar: 'الوجه' },
      { key: 'umluj', en: 'Umluj', ar: 'أملج' },
    ]
  },
  {
    key: 'eastern',
    en: 'Eastern Province',
    ar: 'المنطقة الشرقية',
    districts: [
      { key: 'dammam', en: 'Dammam', ar: 'الدمام' },
      { key: 'dhahran', en: 'Dhahran', ar: 'الظهران' },
      { key: 'khobar', en: 'Al Khobar', ar: 'الخبر' },
      { key: 'qatif', en: 'Qatif', ar: 'القطيف' },
      { key: 'jubail', en: 'Jubail', ar: 'الجبيل' },
      { key: 'hasa', en: 'Al-Ahsa', ar: 'الأحساء' },
      { key: 'hofuf', en: 'Hofuf', ar: 'الهفوف' },
      { key: 'mubarraz', en: 'Al Mubarraz', ar: 'المبرز' },
      { key: 'hafr_batin', en: 'Hafar Al-Batin', ar: 'حفر الباطن' },
      { key: 'khafji', en: 'Al Khafji', ar: 'الخفجي' },
      { key: 'ras_tanura', en: 'Ras Tanura', ar: 'رأس تنورة' },
      { key: 'buqayq', en: 'Abqaiq', ar: 'بقيق' },
      { key: 'nairiyah', en: 'An Nairiyah', ar: 'النعيرية' },
      { key: 'qurayyat', en: 'Qurayyat', ar: 'قرية العليا' },
      { key: 'awamiyah', en: 'Awamiyah', ar: 'العوامية' },
      { key: 'safwa', en: 'Safwa', ar: 'صفوى' },
      { key: 'saihat', en: 'Saihat', ar: 'سيهات' },
      { key: 'tarut', en: 'Tarut', ar: 'تاروت' },
    ]
  },
  {
    key: 'asir',
    en: 'Asir Region',
    ar: 'منطقة عسير',
    districts: [
      { key: 'abha', en: 'Abha', ar: 'أبها' },
      { key: 'khamis_mushait', en: 'Khamis Mushait', ar: 'خميس مشيط' },
      { key: 'bisha', en: 'Bisha', ar: 'بيشة' },
      { key: 'namas', en: 'An Namas', ar: 'النماص' },
      { key: 'muhayil', en: 'Muhayil', ar: 'محايل' },
      { key: 'sarat_abidah', en: 'Sarat Abidah', ar: 'سراة عبيدة' },
      { key: 'rijal_alma', en: 'Rijal Almaa', ar: 'رجال ألمع' },
      { key: 'ahad_rafidah', en: 'Ahad Rafidah', ar: 'أحد رفيدة' },
      { key: 'dhahran_janub', en: 'Dhahran Al Janub', ar: 'ظهران الجنوب' },
      { key: 'tathlith', en: 'Tathlith', ar: 'تثليث' },
      { key: 'bariq', en: 'Bariq', ar: 'بارق' },
      { key: 'majaridah', en: 'Al Majaridah', ar: 'المجاردة' },
      { key: 'balqarn', en: 'Balqarn', ar: 'بلقرن' },
      { key: 'tanumah', en: 'Tanumah', ar: 'تنومة' },
    ]
  },
  {
    key: 'tabuk',
    en: 'Tabuk Region',
    ar: 'منطقة تبوك',
    districts: [
      { key: 'tabuk_city', en: 'Tabuk', ar: 'تبوك' },
      { key: 'umluj', en: 'Umluj', ar: 'أملج' },
      { key: 'wajh', en: 'Al Wajh', ar: 'الوجه' },
      { key: 'duba', en: 'Duba', ar: 'ضباء' },
      { key: 'tayma', en: 'Tayma', ar: 'تيماء' },
      { key: 'haql', en: 'Haql', ar: 'حقل' },
      { key: 'sharma', en: 'Sharma', ar: 'شرما' },
    ]
  },
  {
    key: 'hail',
    en: 'Hail Region',
    ar: 'منطقة حائل',
    districts: [
      { key: 'hail_city', en: 'Hail', ar: 'حائل' },
      { key: 'baqaa', en: 'Baqaa', ar: 'بقعاء' },
      { key: 'ghazalah', en: 'Al Ghazalah', ar: 'الغزالة' },
      { key: 'shamli', en: 'Ash Shamli', ar: 'الشملي' },
      { key: 'shinan', en: 'Ash Shinan', ar: 'الشنان' },
      { key: 'muwaylih', en: 'Al Muwaylih', ar: 'المويلح' },
      { key: 'sulaymi', en: 'As Sulaymi', ar: 'السليمي' },
    ]
  },
  {
    key: 'northern_borders',
    en: 'Northern Borders Region',
    ar: 'منطقة الحدود الشمالية',
    districts: [
      { key: 'arar', en: 'Arar', ar: 'عرعر' },
      { key: 'rafha', en: 'Rafha', ar: 'رفحاء' },
      { key: 'turayf', en: 'Turayf', ar: 'طريف' },
      { key: 'uwayqilah', en: 'Al Uwayqilah', ar: 'العويقيلة' },
    ]
  },
  {
    key: 'jazan',
    en: 'Jazan Region',
    ar: 'منطقة جازان',
    districts: [
      { key: 'jazan_city', en: 'Jazan', ar: 'جازان' },
      { key: 'sabya', en: 'Sabya', ar: 'صبيا' },
      { key: 'abu_arish', en: 'Abu Arish', ar: 'أبو عريش' },
      { key: 'samtah', en: 'Samtah', ar: 'صامطة' },
      { key: 'ahad_masarihah', en: 'Ahad Al Masarihah', ar: 'أحد المسارحة' },
      { key: 'damad', en: 'Damad', ar: 'ضمد' },
      { key: 'farasan', en: 'Farasan', ar: 'فرسان' },
      { key: 'addayer', en: 'Ad Dayer', ar: 'الداير' },
      { key: 'addair', en: 'Ad Darb', ar: 'الدرب' },
      { key: 'baysh', en: 'Baysh', ar: 'بيش' },
      { key: 'fayfa', en: 'Fayfa', ar: 'فيفا' },
      { key: 'aridhah', en: 'Al Aridhah', ar: 'العارضة' },
      { key: 'harub', en: 'Harub', ar: 'هروب' },
      { key: 'idabi', en: 'Al Idabi', ar: 'العيدابي' },
      { key: 'raith', en: 'Ar Rayth', ar: 'الريث' },
    ]
  },
  {
    key: 'najran',
    en: 'Najran Region',
    ar: 'منطقة نجران',
    districts: [
      { key: 'najran_city', en: 'Najran', ar: 'نجران' },
      { key: 'sharurah', en: 'Sharurah', ar: 'شرورة' },
      { key: 'hubuna', en: 'Hubuna', ar: 'حبونا' },
      { key: 'badr_janub', en: 'Badr Al Janub', ar: 'بدر الجنوب' },
      { key: 'yadamah', en: 'Yadamah', ar: 'يدمة' },
      { key: 'thar', en: 'Thar', ar: 'ثار' },
      { key: 'khubash', en: 'Khubash', ar: 'خباش' },
    ]
  },
  {
    key: 'baha',
    en: 'Al Bahah Region',
    ar: 'منطقة الباحة',
    districts: [
      { key: 'baha_city', en: 'Al Bahah', ar: 'الباحة' },
      { key: 'baljurashi', en: 'Baljurashi', ar: 'بلجرشي' },
      { key: 'mandaq', en: 'Al Mandaq', ar: 'المندق' },
      { key: 'mikhwah', en: 'Al Mikhwah', ar: 'المخواة' },
      { key: 'aqiq', en: 'Al Aqiq', ar: 'العقيق' },
      { key: 'qilwah', en: 'Qilwah', ar: 'قلوة' },
      { key: 'hajrah', en: 'Al Hajrah', ar: 'الحجرة' },
      { key: 'ghamid_zinad', en: 'Ghamid Az Zinad', ar: 'غامد الزناد' },
      { key: 'qura', en: 'Al Qura', ar: 'القرى' },
    ]
  },
  {
    key: 'jouf',
    en: 'Al-Jouf Region',
    ar: 'منطقة الجوف',
    districts: [
      { key: 'sakaka', en: 'Sakaka', ar: 'سكاكا' },
      { key: 'dumat_jandal', en: 'Dumat Al-Jandal', ar: 'دومة الجندل' },
      { key: 'qurayat', en: 'Qurayyat', ar: 'القريات' },
      { key: 'tabarjal', en: 'Tabarjal', ar: 'طبرجل' },
    ]
  },
  {
    key: 'qassim',
    en: 'Qassim Region',
    ar: 'منطقة القصيم',
    districts: [
      { key: 'buraidah', en: 'Buraidah', ar: 'بريدة' },
      { key: 'unaizah', en: 'Unaizah', ar: 'عنيزة' },
      { key: 'rass', en: 'Ar Rass', ar: 'الرس' },
      { key: 'mithnab', en: 'Al Mithnab', ar: 'المذنب' },
      { key: 'bukayriyah', en: 'Al Bukayriyah', ar: 'البكيرية' },
      { key: 'badayi', en: 'Al Badayi', ar: 'البدائع' },
      { key: 'asyah', en: 'Asyah', ar: 'عسية' },
      { key: 'nabhaniyah', en: 'An Nabhaniyah', ar: 'النبهانية' },
      { key: 'shimasiyah', en: 'Ash Shimasiyah', ar: 'الشماسية' },
      { key: 'uyun_jiwa', en: 'Uyun Al Jiwa', ar: 'عيون الجواء' },
      { key: 'riyadh_khabra', en: 'Riyadh Al Khabra', ar: 'رياض الخبراء' },
      { key: 'dhuruiya', en: 'Ad Dhuruiya', ar: 'ضرية' },
      { key: 'qabah', en: 'Qabah', ar: 'قبة' },
    ]
  }
];

// Helper function to get all districts for a province
export function getDistrictsByProvince(provinceKey: string): District[] {
  const province = SAUDI_PROVINCES.find(p => p.key === provinceKey);
  return province?.districts || [];
}

// Helper function to get province by key
export function getProvinceByKey(provinceKey: string): Province | undefined {
  return SAUDI_PROVINCES.find(p => p.key === provinceKey);
}
