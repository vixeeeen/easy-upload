import {
  getIMDBData, fetch,
  getInfoFromBDInfo, getInfoFromMediaInfo,
  getBDType,
} from '../common';
import DOMPurify from 'dompurify';
import { PT_SITE } from '../const';

export default async (info:TorrentInfo.Info) => {
  const { imdbUrl, screenshots, mediaInfos, resolution, source, videoType } = info;
  const siteInfo = PT_SITE.KG;
  const mediaInfo = mediaInfos?.[0] ?? '';
  if (imdbUrl) {
    $('input[type="submit"][value="next >>"]').hide().after('<p>loading...</p>');
    $('input[name="title"]').val(imdbUrl);
    const formData = new FormData();
    formData.append('upstep', '2');
    formData.append('type', '1');
    formData.append('title', imdbUrl);
    const doc = await fetch(`${PT_SITE.KG.url}/upload.php`, {
      method: 'POST',
      responseType: undefined,
      data: formData,
    });

    const uploadPage = new DOMParser().parseFromString(doc, 'text/html');
    $('#upside+div').html($('#upside+div', uploadPage).html());
    const imdbData = await getIMDBData(imdbUrl);
    if (imdbData) {
      const { country, Languages: languages } = imdbData.details;
      $('input[name="lang"]').val(languages);
      let { description, genre, poster = '' } = imdbData;
      const genreMap = siteInfo.genres.map;
      const countryMap = siteInfo.country.map;
      let countryValue = '';
      if (country) {
        countryValue = country.split(',')[0];
        if (countryValue === 'United States') {
          countryValue = 'USA';
        } else if (countryValue === 'United Kingdom') {
          countryValue = 'UK';
        }
      }
      if (!poster) {
        poster = info.poster || '';
      }
      $('select[name="country_id"]').val(countryMap[countryValue as keyof typeof countryMap]);
      const descriptionBBCode = `[img]${encodeURI(poster)}[/img]
      \nSynopsis:\n[quote]${encodeURI(description)}[/quote]
      \n\n${screenshots.map(img => `[img]${encodeURI(img)}[/img]`).join('')}`;
      $('#bbcodetextarea').html(DOMPurify.sanitize(descriptionBBCode));
      const [mainGenre, otherGenre = ''] = genre;
      $('select[name="genre_main_id"]').val(genreMap[mainGenre as keyof typeof genreMap]);
      $('select[name="subgenre"]').val(genreMap[otherGenre as keyof typeof genreMap]);
    }
    $(siteInfo.source.selector).val(siteInfo.source.map[source as keyof typeof siteInfo.source.map]);
    if (!videoType.match('bluray')) {
      $(siteInfo.resolution.selector).val(siteInfo.resolution.map[resolution as keyof typeof siteInfo.resolution.map]);
    } else {
      $(siteInfo.resolution.selector).val('3');
    }
    // subtitle
    const isBluray = videoType.match(/bluray/i);
    const getInfoFunc = isBluray ? getInfoFromBDInfo : getInfoFromMediaInfo;
    const { subtitles = [] } = getInfoFunc(mediaInfo);
    if (subtitles.length) {
      $('input[name="subs"]').val(subtitles.join(','));
    }
    if (videoType === 'dvd') {
      $('input[name="dvdr"]').attr('checked', 'true');
    }
    const specs = videoType === 'dvd' ? buildDvdSpecs(info) : mediaInfo;
    $('#ripspecs').val(specs);
  }
};
function buildDvdSpecs (info:TorrentInfo.Info) {
  const { mediaInfos, size, audioCodec } = info;
  const mediaInfo = mediaInfos?.[0] ?? '';
  const scanType = mediaInfo.includes('NTSC') ? 'NTSC' : 'PAL';
  const dvdType = getBDType(size);
  const audioChannelNumber = mediaInfo.match(/Channel\(s\)\s+:\s+(\d)/)?.[1] || '2';
  const audioName = `${audioCodec?.toUpperCase()} ${audioChannelNumber === '6' ? '5.1' : `${audioChannelNumber}.0`}`;
  const IFOMediaInfo = info.mediaInfos?.find(info => info.includes('.IFO')) ?? '';
  const runtime = IFOMediaInfo.match(/Duration\s*?:([^\n]+)/)?.[1]?.replace(/\s/g, '') ?? '';
  const hour = runtime.match(/(\d)+h/)?.[1] ?? '00';
  const minute = runtime.match(/(\d+)(mn|min)/)?.[1] ?? '';

  return `DVD Label:
DVD Format: ${dvdType} ${scanType}
DVD Audio: ${audioName}
Program(s): Unknown
Menus: Untouched
Video: Untouched
Audio: Untouched
DVD extras: Untouched
Extras contain: 
DVD runtime(s): ${+hour < 10 ? `0${hour}` : hour}:${minute}`;
}
