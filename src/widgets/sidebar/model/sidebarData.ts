// widgets/sidebar/model/sidebarData.ts
export const sidebarData = [
    {
      id: 'NEXUS',
      label: 'NEXUS',
      type: 'folder' as const,
      children: [
        {
          id: '[1] DEFAULT',
          label: '[1] DEFAULT',
          type: 'folder' as const,
        },
        {
          id: '[2] SKT',
          label: '[2] SKT',
          type: 'folder' as const,
          children: [
            { id: 'monitor', label: '모니터링', type: 'file' as const, variant: 'red' as const },
            { id: 'test1', label: 'testtest_00124', type: 'file' as const, variant: 'blue' as const },
            { id: 'test2', label: 'testtest_00124', type: 'file' as const, variant: 'blue' as const },
            {
              id: '1247 그룹',
              label: '1247 그룹',
              type: 'folder' as const,
              children: [
                { id: 'kaka1', label: '카카오톡회원', type: 'file' as const, variant: 'green' as const },
                { id: 'kaka2', label: '카카오톡회원', type: 'file' as const, variant: 'red' as const },
                { id: 'kaka3', label: '카카오톡회원', type: 'file' as const, variant: 'blue' as const },
              ]
            },
            { id: 'pds', label: 'PDS_Web_Only', type: 'file' as const, variant: 'green' as const },
            { id: 'asdf', label: 'asldk;jflkasdjfkds', type: 'file' as const, variant: 'red' as const },
          ]
        },
        {
          id: '[3] KAKAO ENTER',
          label: '[3] KAKAO ENTER',
          type: 'folder' as const,
        },
        {
          id: '[4] SK렌트카',
          label: '[4] SK렌트카',
          type: 'folder' as const,
        }
      ]
    }
  ];