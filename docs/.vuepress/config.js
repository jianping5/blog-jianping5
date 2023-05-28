const { description } = require('../../package.json')
const path = require("path")
module.exports = {

  theme: '@vuepress/blog',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: 'Jianping5',
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'apple-mobile-web-app-status-bar-style', content: 'black' }],
    ['link', { rel: 'icon', href: 'favicon.jpg'}]
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    lastUpdated: 'Last Updated', // string | boolean
    directories: [
      {
        id: "post",
        dirname: "_post",
        title: "Blog",
        path: "/post/",
        itemPermalink: "/post/:year/:month/:day/:slug"
      },
      {
        id: "about",
        dirname: "_about",
        title: "About",
        path: "/about/",
        itemPermalink: "/about/:year/:month/:day/:slug"
      }
    ],
    sitemap: {
      hostname: "http://localhost:8080/"
    },
    // comment: {
    //   service: "vssue",
    //   autoCreateIssue: true,
    //   prefix: "[Post]",
    //   owner: "newsbielt703",
    //   repo: "jianping5",
    //   clientId: "4119e8c1b0093fc5d034",
    //   clientSecret: "1ac1176791689b1ca31037c39489fc7b0667015d"
    // },
    // newsletter: {
    //   endpoint:
    //     "https://gmail.us5.list-manage.com/subscribe/post?u=942c0d587f8ea28269e80d6cd&amp;id=d77d789d53"
    // },
    // feed: {
    //   canonical_base: "https://billyyyyy3320.com/",
    //   posts_directories: ["/_en/"]
    // },
    nav: [
      {
        text: "Blog",
        link: "/post/"
      },
      {
        text: "About",
        link: "/about/"
      },
      {
        text: "Github",
        link: "https://github.com/jianping5"
      }
    ],
    footer: {
      contact: [
        {
          type: "github",
          link: "https://github.com/jianping5"
        },
        {
          type: "mail",
          link: "mailto:jianping756@gmail.com"
        }
      ],
      copyright: [
        {
          text: "jianping5 © 2019",
          link: ""
        }
      ]
    },
    smoothScroll: true,
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: [
    '@vuepress/plugin-back-to-top',
    '@vuepress/plugin-medium-zoom',
  ]
}
