import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

type PolicyBlockLocalized = { type: 'p' | 'ul'; text?: string; items?: string[] };

interface PolicySectionLocalized {
  id: string;
  title: string;
  icon?: string;
  blocks: PolicyBlockLocalized[];
}

type PolicyBlockKey = { type: 'p' | 'ul'; textKey?: string; itemKeys?: string[] };

interface PolicySectionKey {
  id: string;
  titleKey: string;
  icon?: string;
  blocks: PolicyBlockKey[];
}

@Component({
  selector: 'app-policies',
  templateUrl: './policies.component.html',
  styleUrls: ['./policies.component.scss'],
  standalone: false,
})
export class PoliciesComponent implements OnInit, OnDestroy {
  // ====== EDIT THESE ======
  appName = 'Rajee';
  companyName = 'Rajee Marketplace';
  supportEmail = 'support@rajeemarketplace.com';
  supportPhone = '+92-3XX-XXXXXXX';
  websiteUrl = 'https://rajeemarketplace.com';
  address = 'Pakistan';
  lastUpdated = '18 Jan 2026';

  defaultOpenSectionId = 'intro';

  query = '';
  selectedLanguage = 'en';

  private langSub?: Subscription;

  // keys-based sections (language independent)
  private sectionsKeys: PolicySectionKey[] = [
    {
      id: 'intro',
      titleKey: 'policies.sections.overview.title',
      icon: 'information-circle-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.overview.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.overview.ul1.i1',
            'policies.sections.overview.ul1.i2',
            'policies.sections.overview.ul1.i3',
          ],
        },
      ],
    },

    {
      id: 'privacy',
      titleKey: 'policies.sections.privacy.title',
      icon: 'shield-checkmark-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.privacy.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.privacy.ul1.i1',
            'policies.sections.privacy.ul1.i2',
            'policies.sections.privacy.ul1.i3',
            'policies.sections.privacy.ul1.i4',
          ],
        },
        { type: 'p', textKey: 'policies.sections.privacy.p2' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.privacy.ul2.i1',
            'policies.sections.privacy.ul2.i2',
            'policies.sections.privacy.ul2.i3',
            'policies.sections.privacy.ul2.i4',
          ],
        },
        { type: 'p', textKey: 'policies.sections.privacy.p3' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.privacy.ul3.i1',
            'policies.sections.privacy.ul3.i2',
            'policies.sections.privacy.ul3.i3',
          ],
        },
        { type: 'p', textKey: 'policies.sections.privacy.p4' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.privacy.ul4.i1',
            'policies.sections.privacy.ul4.i2',
          ],
        },
        { type: 'p', textKey: 'policies.sections.privacy.p5' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.privacy.ul5.i1',
            'policies.sections.privacy.ul5.i2',
          ],
        },
      ],
    },

    {
      id: 'terms',
      titleKey: 'policies.sections.terms.title',
      icon: 'document-text-outline',
      blocks: [
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.terms.ul1.i1',
            'policies.sections.terms.ul1.i2',
            'policies.sections.terms.ul1.i3',
            'policies.sections.terms.ul1.i4',
            'policies.sections.terms.ul1.i5',
          ],
        },
      ],
    },

    {
      id: 'posting',
      titleKey: 'policies.sections.posting.title',
      icon: 'megaphone-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.posting.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.posting.ul1.i1',
            'policies.sections.posting.ul1.i2',
            'policies.sections.posting.ul1.i3',
            'policies.sections.posting.ul1.i4',
            'policies.sections.posting.ul1.i5',
          ],
        },
      ],
    },

    {
      id: 'prohibited',
      titleKey: 'policies.sections.prohibited.title',
      icon: 'ban-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.prohibited.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.prohibited.ul1.i1',
            'policies.sections.prohibited.ul1.i2',
            'policies.sections.prohibited.ul1.i3',
            'policies.sections.prohibited.ul1.i4',
            'policies.sections.prohibited.ul1.i5',
            'policies.sections.prohibited.ul1.i6',
          ],
        },
      ],
    },

    {
      id: 'reporting',
      titleKey: 'policies.sections.reporting.title',
      icon: 'flag-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.reporting.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.reporting.ul1.i1',
            'policies.sections.reporting.ul1.i2',
            'policies.sections.reporting.ul1.i3',
            'policies.sections.reporting.ul1.i4',
          ],
        },
      ],
    },

    {
      id: 'safety',
      titleKey: 'policies.sections.safety.title',
      icon: 'alert-circle-outline',
      blocks: [
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.safety.ul1.i1',
            'policies.sections.safety.ul1.i2',
            'policies.sections.safety.ul1.i3',
            'policies.sections.safety.ul1.i4',
          ],
        },
      ],
    },

    {
      id: 'payments',
      titleKey: 'policies.sections.payments.title',
      icon: 'card-outline',
      blocks: [
        { type: 'p', textKey: 'policies.sections.payments.p1' },
        {
          type: 'ul',
          itemKeys: [
            'policies.sections.payments.ul1.i1',
            'policies.sections.payments.ul1.i2',
            'policies.sections.payments.ul1.i3',
          ],
        },
      ],
    },

    // {
    //   id: 'contact',
    //   titleKey: 'policies.sections.contact.title',
    //   icon: 'mail-outline',
    //   blocks: [{ type: 'p', textKey: 'policies.sections.contact.p1' }],
    // },
  ];

  // localized sections (UI uses this)
  private localizedSections: PolicySectionLocalized[] = [];

  constructor(private translate: TranslateService) {}

  ngOnInit(): void {
    const savedLang = localStorage.getItem('lang');
    this.selectedLanguage = savedLang || this.translate.currentLang || 'en';

    this.translate.use(this.selectedLanguage);
    this.applyDirection(this.selectedLanguage);
    this.buildLocalizedSections();

    this.langSub = this.translate.onLangChange.subscribe((ev) => {
      this.selectedLanguage = ev.lang || this.translate.currentLang || 'en';
      localStorage.setItem('lang', this.selectedLanguage);
      this.applyDirection(this.selectedLanguage);
      this.buildLocalizedSections();
    });
  }

  ngOnDestroy(): void {
    this.langSub?.unsubscribe();
  }

  // Search is performed on translated strings
  get filteredSections(): PolicySectionLocalized[] {
    const q = (this.query || '').trim().toLowerCase();
    if (!q) return this.localizedSections;

    return this.localizedSections.filter((s) => {
      if ((s.title || '').toLowerCase().includes(q)) return true;

      return (s.blocks || []).some((b) => {
        if (b.type === 'p' && (b.text || '').toLowerCase().includes(q)) return true;
        if (b.type === 'ul' && (b.items || []).some((x) => (x || '').toLowerCase().includes(q))) return true;
        return false;
      });
    });
  }

  mailToSupport(): void {
    window.location.href = `mailto:${this.supportEmail}?subject=${encodeURIComponent(
      this.appName + ' Support'
    )}`;
  }

  toggleLanguage(): void {
    const next = this.selectedLanguage === 'en' ? 'ar' : 'en';
    this.translate.use(next);
  }

  private buildLocalizedSections(): void {
    const params = {
      appName: this.appName,
      companyName: this.companyName,
      supportEmail: this.supportEmail,
      supportPhone: this.supportPhone,
      websiteUrl: this.websiteUrl,
      address: this.address,
      lastUpdated: this.lastUpdated,
    };

    this.localizedSections = this.sectionsKeys.map((s) => {
      const title = this.translate.instant(s.titleKey, params);

      const blocks: PolicyBlockLocalized[] = (s.blocks || []).map((b) => {
        if (b.type === 'p') {
          return { type: 'p', text: this.translate.instant(b.textKey || '', params) };
        }
        return {
          type: 'ul',
          items: (b.itemKeys || []).map((k) => this.translate.instant(k, params)),
        };
      });

      return { id: s.id, icon: s.icon, title, blocks };
    });
  }

  private applyDirection(lang: string): void {
    // const dir = lang === 'ar' ? 'rtl' : 'ltr';
    // document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }
}
