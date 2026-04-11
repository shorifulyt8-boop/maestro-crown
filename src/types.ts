export interface PrincipalData {
  name: string;
  message: string;
  image: string;
}

export interface Notice {
  id: string;
  title: string;
  date: string;
  url?: string;
}

export interface Link {
  id: string;
  title: string;
  url: string;
}

export interface PageContent {
  title: string;
  content: string;
  subPages?: Record<string, PageContent>;
}

export interface CollegeInfo {
  eiin: string;
  location: string;
  established: string;
  phone: string;
  email: string;
}

export interface TickerItem {
  id: string;
  text: string;
  url?: string;
}

export interface SiteData {
  siteTitle: string;
  siteLogo: string;
  tickerItems: TickerItem[];
  collegeInfo: CollegeInfo;
  principal: PrincipalData;
  pages: {
    about: PageContent;
    administration: PageContent;
    academic: PageContent;
    facilities: PageContent;
    admission: PageContent;
    results: PageContent;
    gallery: PageContent;
    contact: PageContent;
  };
  notices: Notice[];
  importantLinks: Link[];
  bannerImages: string[];
}
