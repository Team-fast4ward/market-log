import { $ } from './dom';

export const toggleLoadingSpinner = (isActive: boolean) => {
  isActive
    ? (($('.loadingGif').style.display = 'block'),
      ($('body').style.overflow = 'hidden'))
    : (($('.loadingGif').style.display = 'none'),
      ($('body').style.overflow = 'visible'));
};
