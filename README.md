# ![Agent First](assets/social/logotype-optimized.png) [![X post](assets/social/x-post-optimized.png)](https://x.com/intent/post?text=Enhance%20your%20AI%20agent%20with%20research%20and%20browsing%20abilities%3A&url=https%3A%2F%2Fagentfirst.dev%2F%3Fref%3Dgithub&via=agentfirstdev)

_The missing services for agent-first development_

## Whitelabel documentation

[Agent First’s documentation](https://doc.agentfirst.dev/) has been optimized for whitelabeling on
the **Mintlify** platform. If you use another documentation platform,
[contact us to get help](mailto:brain@agentfirst.dev).

### Mintlify integration

Follow the steps below to host our documentation on **Mintlify**.

1. **Download submodule**

   Go to your **Mintlify** directory then download this project:

   ```shell
   git submodule add https://github.com/agentfirstdev/whitelabel
   ```

2. **Customize documentation**

   Switch to the whitelabel subdirectory then customize the documentation by calling the whitelabel
   script with a subdirectory name and URL path to nest the documentation under, as well as your
   company name and API domain:

   ```shell
   cd whitelabel
   npm run whitelabel -- \
   --path='[subdirectory/pathname here]' \
   --company='[company name here]' \
   --endpoint=[API domain here]
   ```

   > _Customization example_
   >
   > We used `endpoints`, as in https://doc.agentfirst.dev/endpoints/search, `Agent First`, and
   > `api.agentfirst.dev`:
   >
   > ```shell
   > cd whitelabel
   > npm run whitelabel -- \
   > --path=endpoints \
   > --company='Agent First' \
   > --endpoint=api.agentfirst.dev
   > ```

3. **Link pages**

   Link to whichever tutorial and reference pages you want in your navigation by editing the
   `docs.json` file at the **Mintlify** root.

   > _Navigation example_
   >
   > Here’s how we link from
   > [our configuration file](https://github.com/agentfirstdev/doc/blob/main/docs.json#L13-L50):
   >
   > ```json
   > "...",
   > "navigation": {
   >   "groups": [
   >     "...",
   >     {
   >       "group": "API",
   >       "pages": [
   >         "endpoints/search",
   >         "endpoints/browser",
   >         "endpoints/geotargeting",
   >         "endpoints/scheduling",
   >         "endpoints/reporting",
   >         {
   >           "group": "Reference",
   >           "icon": "book",
   >           "iconType": "light",
   >           "pages": [
   >             {
   >               "group": "Search",
   >               "pages": [
   >                 "endpoints/reference/search",
   >                 "endpoints/reference/search/results"
   >               ]
   >             },
   >             {
   >               "group": "Browsing",
   >               "pages": [
   >                 "endpoints/reference/browser",
   >                 "endpoints/reference/browser/content",
   >                 "endpoints/reference/browser/devices"
   >               ]
   >             },
   >             { "group": "Reporting", "pages": ["endpoints/reference/usage"] },
   >             "..."
   >           ]
   >         }
   >       ]
   >     },
   >     "..."
   >   ]
   > },
   > "..."
   > ```

4. **Preview changes**

   Switch back to the **Mintlify** root then preview your changes as usual:

   ```shell
   cd ..
   mint dev
   ```

   A local copy of your documentation will be hosted at http://localhost:3000/.

5. **Publish changes**

   Publish your changes after reviewing them:

   ```shell
   git push
   ```

   If you’ve connected your repository to **Mintlify**, your documentation will be automatically
   deployed.

6. **Incorporate updates**

   To incorporate documentation updates later, resync this project from your **Mintlify** directory
   then execute the whitelabel script again:

   ```shell
   git submodule update --remote
   cd whitelabel
   npm run whitelabel -- \
   --path='[subdirectory/pathname here]' \
   --company='[company name here]' \
   --endpoint=[API domain here]
   ```

## License

Copyright 2025– Agent First Dev, LLC.

This program is free software, excluding the brand features and third-party portions of the program
identified in the [Exceptions](#exceptions) below: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software Foundation, either
version 3 of the License, or (at your option) any later version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
[GNU General Public License](https://www.gnu.org/licenses/gpl-3.0.html) for more details.

## Exceptions

The **Agent First** logos, trademarks, domain names, and other brand features used in this program
cannot be reused without permission and no license is granted thereto.
