import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Province } from 'src/app/shared/saudi-provinces';

@Component({
  selector: 'app-haraj-location-sheet',
  templateUrl: './haraj-location-sheet.component.html',
  styleUrls: ['./haraj-location-sheet.component.scss'],
  standalone: false
})
export class HarajLocationSheetComponent implements OnInit {

    @Input() language: 'en' | 'ar' = 'en';
    @Input() provinces: Province[] = [];

    @Input() selectedProvince = '';
    @Input() selectedDistrict = '';

    step: 1 | 2 = 1;
    search = '';

    tempProvince = '';
    tempDistrict = '';

    constructor(private modalCtrl: ModalController) {}

    ngOnInit() {
      this.tempProvince = this.selectedProvince || (this.provinces?.[0]?.key || '');
      const p = this.provinces.find(x => x.key === this.tempProvince);
      this.tempDistrict = this.selectedDistrict || (p?.districts?.[0]?.key || '');
    }

    get title(): string {
      return this.step === 1 ? 'Location' : 'District';
    }

    get items(): any[] {
      const list = this.step === 1
        ? this.provinces
        : (this.provinces.find(p => p.key === this.tempProvince)?.districts || []);

      const q = (this.search || '').toLowerCase().trim();
      if (!q) return list;

      return list.filter((x: any) => (this.labelOf(x) || '').toLowerCase().includes(q));
    }

    labelOf(x: any) {
      return this.language === 'en' ? (x.en || '') : (x.ar || '');
    }

    selectProvince(key: string) {
      this.tempProvince = key;
      const p = this.provinces.find(x => x.key === key);
      this.tempDistrict = p?.districts?.[0]?.key || '';
      this.step = 2;
      this.search = '';
    }

    selectDistrict(key: string) {
      this.tempDistrict = key;
    }

    back() {
      this.step = 1;
      this.search = '';
    }

    close() {
      this.modalCtrl.dismiss();
    }

    confirm() {
      this.modalCtrl.dismiss({ provinceKey: this.tempProvince, districtKey: this.tempDistrict });
    }

    isChecked(key: string) {
      return this.step === 1 ? this.tempProvince === key : this.tempDistrict === key;
    }
  }

