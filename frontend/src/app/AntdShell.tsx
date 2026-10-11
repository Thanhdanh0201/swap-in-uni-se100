import { App, ConfigProvider } from 'antd'
import viVN from 'antd/locale/vi_VN'
import type { ReactNode } from 'react'
import { antdTheme } from '../theme'

export function AntdShell({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider theme={antdTheme} locale={viVN}>
      <App>{children}</App>
    </ConfigProvider>
  )
}
