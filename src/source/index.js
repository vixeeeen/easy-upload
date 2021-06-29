import { CURRENT_SITE_NAME, CURRENT_SITE_INFO } from '../const';

import getPTPInfo from './ptp';
import getBHDInfo from './bhd';
import getHDBInfo from './hdb';
import getTTGInfo from './ttg';
import getUNIT3DInfo from './unit3d';
import getNexusPHPInfo from './nexusphp';
import getHDTInfo from './hdt';
import getKGInfo from './kg';
import getUHDInfo from './uhd';
import getBTNInfo from './btn';
import getAvistaZInfo from './avistaz';
import getTeamHDInfo from './teamhd';
import getHDSpaceInfo from './hdspace';

let getTorrentInfo;
if (!CURRENT_SITE_INFO) {
  getTorrentInfo = null;
} else if (CURRENT_SITE_INFO.siteType === 'NexusPHP') {
  getTorrentInfo = getNexusPHPInfo;
} else if (CURRENT_SITE_NAME === 'BeyondHD') {
  getTorrentInfo = getBHDInfo;
} else if (CURRENT_SITE_NAME === 'HDBits') {
  getTorrentInfo = getHDBInfo;
} else if (CURRENT_SITE_NAME === 'TTG') {
  getTorrentInfo = getTTGInfo;
} else if (CURRENT_SITE_INFO.siteType === 'UNIT3D') {
  getTorrentInfo = getUNIT3DInfo;
} else if (CURRENT_SITE_NAME === 'HDT') {
  getTorrentInfo = getHDTInfo;
} else if (CURRENT_SITE_NAME === 'KG') {
  getTorrentInfo = getKGInfo;
} else if (CURRENT_SITE_NAME === 'UHDBits') {
  getTorrentInfo = getUHDInfo;
} else if (CURRENT_SITE_NAME === 'PTP') {
  getTorrentInfo = getPTPInfo;
} else if (CURRENT_SITE_NAME === 'BTN') {
  getTorrentInfo = getBTNInfo;
} else if (CURRENT_SITE_INFO.siteType === 'AvistaZ') {
  getTorrentInfo = getAvistaZInfo;
} else if (CURRENT_SITE_NAME === 'TeamHD') {
  getTorrentInfo = getTeamHDInfo;
} else if (CURRENT_SITE_NAME === 'HDSpace') {
  getTorrentInfo = getHDSpaceInfo;
}
export default getTorrentInfo;
