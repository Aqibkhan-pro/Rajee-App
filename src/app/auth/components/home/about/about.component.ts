import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  standalone: false
})
export class AboutComponent implements OnInit {


    // default language
    lang: 'en' | 'ar' = 'en';

    constructor() {}

    ngOnInit() {
      const savedLang = localStorage.getItem('lang') as 'en' | 'ar';
      this.lang = savedLang || 'en';
    }

    scrollTo(id: string) {
      const el = document.getElementById(id);
      if (!el) return;

      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
}
