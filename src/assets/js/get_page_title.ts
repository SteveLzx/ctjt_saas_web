const title = '科技驾培';

export default function getPageTitle(pageTitle?: string): string {
  if (pageTitle) {
    return `${pageTitle} - ${title}`;
  }
  return `${title}`;
}
