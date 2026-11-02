// 配色：暖纸色 + 墨绿 + 琥珀，不用默认的蓝/灰（旧站的 blue-600 全部映射成琥珀强调色，其余页面不用逐个改）
module.exports = {
  theme: {
    extend: {
      colors: {
        blue: { 50: '#fbf3e6', 100: '#f6e4c4', 500: '#c9791f', 600: '#b4670f', 700: '#8f510b' },
        gray: { 50: '#faf7f1', 100: '#f1ece1', 200: '#e3dccd', 300: '#cfc6b3', 400: '#8c8574', 500: '#6f6a5c', 600: '#4f4b40', 700: '#363329', 800: '#252319', 900: '#171610' },
        green: { 500: '#2f7d4f', 600: '#25683f', 700: '#1d5432' },
      },
      fontFamily: {
        serif: ['"Iowan Old Style"', '"Palatino Linotype"', 'Palatino', 'Georgia', 'serif'],
        sans: ['system-ui', '-apple-system', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
    },
  },
}
