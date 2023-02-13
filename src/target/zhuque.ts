import { PT_SITE } from '../const';

import {
  buildPTPDescription,
} from './common';

const currentSiteInfo = PT_SITE.ZHUQUE;

export default (info: TorrentInfo.Info) => {
  const targetNode = document;
  const insert = new MutationObserver(mutationRecords => {
    $('input.ant-select-selection-search-input[id]').each(function () { this.dispatchEvent(new Event('keydown')); });
    $(currentSiteInfo.name.selector).val(info.title);
    $(currentSiteInfo.name.selector)[0].dispatchEvent(new Event('input'));
    if (info.subtitle) {
      $(currentSiteInfo.subtitle.selector).val(info.subtitle);
      $(currentSiteInfo.subtitle.selector)[0].dispatchEvent(new Event('input'));
    }
    if (info.doubanUrl) {
      $(currentSiteInfo.douban.selector).val(info.doubanUrl.match(/subject\/(\d+)/)[1]);
      $(currentSiteInfo.douban.selector)[0].dispatchEvent(new Event('input'));
    }
    let screenshotStr = '';
    if (info.screenshots.length > 0) {
      info.screenshots.forEach(img => {
        screenshotStr += `${img}\n`;
      });
    }
    $(currentSiteInfo.screenshots.selector).val(screenshotStr);
    $(currentSiteInfo.screenshots.selector)[0].dispatchEvent(new Event('input'));
    fillMediaInfo(info);
    fillDescription(info);
    const selectNodeParent = document.querySelector('form');
    const select = new MutationObserver(async mutationRecords => {
      const { category: categoryConfig } = currentSiteInfo;
      $(`div.ant-select-item-option-content:contains(${categoryConfig.map[info.category as keyof typeof categoryConfig.map]})`).click();
      const keyArray = ['videoType', 'videoCodec', 'audioCodec'] as const;
      type Key = typeof keyArray[number]
      keyArray.forEach(key => {
        const { map } = currentSiteInfo[key as Key];
        if (map) {
          const mapValue = map[info[key as Key] as keyof typeof map];
          if (key !== 'videoType' && $(`div.ant-select-item-option-content:contains(${mapValue})`)[0]) {
            $(`div.ant-select-item-option-content:contains(${mapValue})`)[0].click();
          } else if (mapValue === 'Blu-ray') {
            $(`div.ant-select-item-option-content:contains(${mapValue})`)[2].click();
          } else if ($(`div.ant-select-item-option-content:contains(${mapValue})`)[0]) {
            $(`div.ant-select-item-option-content:contains(${mapValue})`)[0].click();
          }
        }
      });
      $(`div.ant-select-item-option-content:contains(${info.resolution})`).click();
      select.disconnect();
      const sleep = (ms: number) => {
        return new Promise((resolve) => setTimeout(resolve, ms));
      };
      for (const tag in info.tags) {
        if (currentSiteInfo.tags[tag]) { await sleep(100).then((v) => $(currentSiteInfo.tags[tag])[0].click()); }
      }
    });
    if (selectNodeParent) { select.observe(selectNodeParent, { attributes: false, childList: true, subtree: true, characterDataOldValue: false }); }
    insert.disconnect();
  });
  insert.observe(targetNode, { attributes: false, childList: false, subtree: true, characterDataOldValue: false });
};
function fillMediaInfo (info: TorrentInfo.Info) {
  $(currentSiteInfo.mediaInfo.selector).val(info.mediaInfo);
  $(currentSiteInfo.mediaInfo.selector)[0].dispatchEvent(new Event('input'));
}
function fillDescription (info: TorrentInfo.Info) {
  let description = info.description.replace(`[quote]${info.mediaInfo}[/quote]`, '').trim();
  if (info.sourceSite === 'PTP') {
    description = buildPTPDescription(info);
  } else if (info.sourceSite.match(/BeyondHD|UHDBits/)) {
    description = info.originalDescription || '';
    description = description.replace(/Screenshots:\n/gi, '').trim(); // BHDinternal组会写
  }
  description = description.replaceAll(/\[url.*\[\/url\]/g, '').replaceAll(/\[img.*\[\/img\]/g, '').replaceAll(/\[\/?(i|b|center|quote|size|color)\]/g, '').replaceAll(/\[(size|color)=#?[a-zA-Z0-9]*\]/g, '').replaceAll(/\n\n*/g, '\n');
  description = description.trim();
  if (description !== '') description = `\`\`\`\n${description}\n\`\`\``; // quote everything
  const thanksQuoteClosed = GM_getValue('easy-seed.thanks-quote-closed') || '';
  if (!thanksQuoteClosed && info.sourceSite !== undefined) {
    description = `\`\`\`\n转自 ${info.sourceSite} ，感谢原发布者！\n\`\`\`\n${description}`;
  }
  $(currentSiteInfo.description.selector).val(description);
  $(currentSiteInfo.description.selector)[0].dispatchEvent(new Event('input'));
}
