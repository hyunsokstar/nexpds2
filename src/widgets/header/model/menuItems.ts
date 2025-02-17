// src/widgets/header/model/menuItems.ts
export interface MenuItem {
  id: number;
  title: string;
  icon: string;
  href: string;
  content: null;
  duplicatable?: boolean;  // 중복 허용 여부만 남기고 uniqueKey 제거
}

export const menuItems: MenuItem[] = [
  { 
    id: 1, 
    title: '캠페인 그룹관리', 
    icon: '/header-menu/캠페인그룹관리.svg', 
    href: '/main',
    content: null,
    duplicatable: false
  },
  { 
    id: 2, 
    title: '캠페인 관리', 
    icon: '/header-menu/캠페인관리.svg', 
    href: '/campaign',
    content: null,
    duplicatable: true
  },
  { 
    id: 3, 
    title: '통합모니터', 
    icon: '/header-menu/통합모니터.svg', 
    href: '/monitor',
    content: null,
    duplicatable: false
  },
  { 
    id: 4, 
    title: '총진행상황', 
    icon: '/header-menu/총진행상황.svg', 
    href: '/status',
    content: null,
    duplicatable: false
  },
  { 
    id: 5, 
    title: '발신진행상태', 
    icon: '/header-menu/발신진행상태.svg', 
    href: '/call',
    content: null,
    duplicatable: true
  },
  { 
    id: 6, 
    title: '채널 모니터', 
    icon: '/header-menu/채널모니터.svg', 
    href: '/channel',
    content: null,
    duplicatable: false
  },
  { 
    id: 7, 
    title: '리스트 매니저', 
    icon: '/header-menu/리스트매니저.svg', 
    href: '/list',
    content: null,
    duplicatable: true
  },
  { 
    id: 8, 
    title: '예약콜 제한 설정', 
    icon: '/header-menu/예약콜제한설정.svg', 
    href: '/reserve',
    content: null,
    duplicatable: false
  },
  { 
    id: 9, 
    title: '분배호수 제한 설정', 
    icon: '/header-menu/분배호수제한설정.svg', 
    href: '/distribute',
    content: null,
    duplicatable: false
  },
  { 
    id: 10, 
    title: '시스템 설정', 
    icon: '/header-menu/시스템설정.svg', 
    href: '/system',
    content: null,
    duplicatable: false
  },
  { 
    id: 11, 
    title: '운영 설정', 
    icon: '/header-menu/운영설정.svg', 
    href: '/operation',
    content: null,
    duplicatable: false
  },
  { 
    id: 12, 
    title: '환경 설정', 
    icon: '/header-menu/환경설정.svg', 
    href: '/settings',
    content: null,
    duplicatable: false
  },
];