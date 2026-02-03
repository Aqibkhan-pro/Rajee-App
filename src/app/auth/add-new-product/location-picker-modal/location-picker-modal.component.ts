import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  Province,
  SAUDI_PROVINCES,
  District,
  getProvinceByKey,
  getDistrictsByProvince
} from 'src/app/shared/saudi-provinces';
import { locationAnim } from 'src/app/shared/utils/anim';

@Component({
  selector: 'app-location-picker-modal',
  templateUrl: './location-picker-modal.component.html',
  styleUrls: ['./location-picker-modal.component.scss'],
  standalone: false,
  animations: [locationAnim],
})
export class LocationPickerModalComponent implements OnInit {
  @Input() lang: 'en' | 'ar' = 'en';
  @Input() provinceKey: string | null = null;
  @Input() districtKey: string | null = null;

  step = 0;

  provinces: Province[] = SAUDI_PROVINCES;
  districts: District[] = [];

  searchProvince = '';
  searchDistrict = '';

  selectedProvince: Province | null = null;
  selectedDistrict: District | null = null;

  constructor(private modalCtrl: ModalController) {}

  ngOnInit() {
    // preselect (if parent sent keys)
    if (this.provinceKey) {
      const p = getProvinceByKey(this.provinceKey);
      if (p) {
        this.selectedProvince = p;
        this.districts = getDistrictsByProvince(p.key);

        if (this.districtKey) {
          this.selectedDistrict = this.districts.find(d => d.key === this.districtKey) || null;
        }
      }
    }

    // if province already selected but district not selected => open districts step
    if (this.selectedProvince && !this.selectedDistrict) {
      this.step = 1;
    }
  }

  close() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  back() {
    if (this.step > 0) {
      this.step--;
      return;
    }
    this.close();
  }

  chooseProvince(p: Province) {
    this.selectedProvince = p;
    this.provinceKey = p.key;

    this.districts = getDistrictsByProvince(p.key);
    this.searchDistrict = '';
    this.selectedDistrict = null;
    this.districtKey = null;

    this.step = 1; // auto next
  }

  // ✅ district click => close modal + send data to parent
  selectDistrictAndClose(d: District) {
    this.selectedDistrict = d;
    this.districtKey = d.key;

    if (!this.selectedProvince) return;

    this.modalCtrl.dismiss(
      {
        provinceKey: this.selectedProvince.key,
        districtKey: d.key,
        province: this.selectedProvince,
        district: d,
      },
      'confirm'
    );
  }

  // filters
  get filteredProvinces(): Province[] {
    const q = (this.searchProvince || '').toLowerCase().trim();
    if (!q) return this.provinces;

    return this.provinces.filter(p => {
      const en = (p.en || '').toLowerCase();
      const ar = (p.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q);
    });
  }

  get filteredDistricts(): District[] {
    const q = (this.searchDistrict || '').toLowerCase().trim();
    if (!q) return this.districts;

    return this.districts.filter(d => {
      const en = (d.en || '').toLowerCase();
      const ar = (d.ar || '').toLowerCase();
      return en.includes(q) || ar.includes(q);
    });
  }

  labelProvince(p: Province): string {
    return this.lang === 'ar' ? p.ar : p.en;
  }

  labelDistrict(d: District): string {
    return this.lang === 'ar' ? d.ar : d.en;
  }
}
