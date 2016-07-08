

Get the main docs package setup to play nice with other themes and plugins

  - Allow user to define a folder with custom annotations, or a different layout and be able to include those in the
    express app. With the defaults there if those files don't exist.

    ```
    users-project/
      ├── docs/
      |    └── views/
      |        └── annotations/
      |           └── access.jade // this would take precedence over the one defined in the theme
      └── node_modules/
          └── docs-theme-default/
              └── views/
                └── annotations/
                    └── access.jade // this wouldn't be used because one of
    ```
  - Allow for plugins like `docs-plugin-content`
    This can contain the annotation @content for scss as well as the how the @content would appear

  - A huge one is to add the ability to search the documentation. This is something that is necessary before a full
    release but it can wait for the beta. Just keep it in mind while building everything out.

  - Very low priority is to update most of the things to use an event emitter.

  - Figure out why Travis CI is failing for node v4* and v0.12 when it works just fine when I use nvm to switch to those versions.