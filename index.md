--
title: Backend Tech Blog
subtitle: This is the site for the various backend issues
layout: page
callouts: home_callouts
show_sidebar: true
---

# Bulma Clean Theme demo website

This website showcases the options for the Bulma Clean theme. The theme is available as a ruby gem or can be used with GitHub pages. 

[![Gem Version](https://badge.fury.io/rb/bulma-clean-theme.svg)](https://badge.fury.io/rb/bulma-clean-theme)
![Gem](https://img.shields.io/gem/dt/bulma-clean-theme.svg)

<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a>
      {{ post.excerpt }}
    </li>
  {% endfor %}
</ul>

## GitHub Pages

The theme can be used with GitHub Pages bu setting the `remote_theme` in your Jekyll sites `_config.yml`

```yml
remote_theme: chrisrhymes/bulma-clean-theme
```

## Instructions

For full instructions, please see the Readme at the GitHub repo:
[https://github.com/chrisrhymes/bulma-clean-theme/blob/master/README.md](https://github.com/chrisrhymes/bulma-clean-theme/blob/master/README.md)

## Page Layouts

This demo site showcases the available page layout options.

* Page With Sidebar
* Page Without Sidebar
* Page With Menubar
* Page With Tabs
* Landing Page With Callouts
* Blog
* Post
