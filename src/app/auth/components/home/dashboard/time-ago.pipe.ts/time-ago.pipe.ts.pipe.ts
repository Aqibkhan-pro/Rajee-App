import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(ts: any, nowTs: number, lang: 'en' | 'ar' | string = 'en'): string {
    const t = Number(ts || 0);
    const isAr = lang === 'ar';
    if (!t) return isAr ? 'غير معروف' : 'Unknown';

    const diffMs = Math.max(0, Number(nowTs || Date.now()) - t);
    const sec = Math.floor(diffMs / 1000);

    if (sec < 10) return isAr ? 'الآن' : 'Just now';
    if (sec < 60) return isAr ? `قبل ${sec} ثانية` : `${sec} sec ago`;

    const min = Math.floor(sec / 60);
    if (min < 60) return isAr ? `قبل ${min} دقيقة` : `${min} min ago`;

    const hr = Math.floor(min / 60);
    if (hr < 24) return isAr ? `قبل ${hr} ساعة` : `${hr} hr ago`;

    const day = Math.floor(hr / 24);
    if (day === 1) return isAr ? 'أمس' : 'Yesterday';
    if (day < 7) return isAr ? `قبل ${day} أيام` : `${day} days ago`;

    const d = new Date(t);
    return isAr
      ? d.toLocaleDateString('ar', {  month: 'short', day: '2-digit' })
      : d.toLocaleDateString('en', { month: 'short', day: '2-digit' });
  }
}