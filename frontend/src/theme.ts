import type { ThemeConfig } from 'antd'

// Ant Design dùng ở các trang client-only (đăng bán, tin nhắn, quản trị). Giá trị khớp src/styles/tokens.css.
export const antdTheme: ThemeConfig = {
  cssVar: {},
  token: {
    colorPrimary: '#0041d9', // --color-primary
    colorInfo: '#0041d9',
    colorSuccess: '#0f7b4b', // --color-success
    colorError: '#c4262e', // --color-danger
    colorText: '#121722', // --color-text
    colorBorder: '#dde2eb', // --color-border
    colorBgLayout: '#f4f6fa', // --color-bg
    fontFamily: "'Be Vietnam Pro', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    borderRadius: 8,
    borderRadiusLG: 12,
  },
}
