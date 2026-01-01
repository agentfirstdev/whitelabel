# ![Agent First](assets/social/logotype-optimized.png) [![X post](assets/social/x-post-optimized.png)](https://x.com/intent/post?text=Enhance%20your%20AI%20agent%20with%20research%20and%20browsing%20abilities%3A&url=https%3A%2F%2Fagentfirst.dev%2F%3Fref%3Dgithub&via=agentfirstdev)

*The missing services for agent-first development*

## Agent First whitelabel documentation

**Agent First** documentation has been optimized for whitelabeling on the **Mintlify** platform. If
you use another documentation platform, [contact us to get help](mailto:brain@agentfirst.dev).

### Mintlify integration

Follow the steps below to host our documentation on **Mintlify**.

1. **Import project**

   Go to your **Mintlify** directory then import this project by choosing a subdirectory name and
   URL path to nest the documentation under:

   ```shell
   git subtree add \
   --prefix='[subdirectory/pathname here]' \
   --squash \
   https://github.com/agentfirstdev/whitelabel \
   main
   ```

   **Subdirectory/pathname example**

   We chose `endpoints`, as in https://doc.agentfirst.dev/endpoints/search:

   ```shell
   git subtree add \
   --prefix=endpoints \
   --squash \
   https://github.com/agentfirstdev/whitelabel \
   main
   ```

2. **Download dependencies**

   Switch to your new subdirectory then download the Node.js dependencies:

   ```shell
   cd '[subdirectory/pathname here]'
   npm i
   ```

3. **Brand documentation**

   Brand the documentation by calling the whitelabel script with your company name and API domain of
   choice:

   ```shell
   npm run whitelabel -- \
   --company='[company name here]'\
   --endpoint=[API domain here]
   ```

   **Branding example**

   Here’s how we branded our documentation:

   ```shell
   npm run whitelabel -- \
   --company='Agent First' \
   --endpoint=api.agentfirst.dev
   ```

4. **Link pages**

   Link to whichever tutorial and reference pages you want in your navigation by editing the
   `docs.json` file at the **Mintlify** root.

   **Navigation example**

   Here’s how we link from
   [our configuration file](https://github.com/agentfirstdev/doc/blob/main/docs.json#L13-L50):

   ```json
   ...
   "navigation": {
     "groups": [
       "...",
       {
         "group": "API",
         "pages": [
           "endpoints/search",
           "endpoints/browser",
           "endpoints/geotargeting",
           "endpoints/scheduling",
           "endpoints/reporting",
           {
             "group": "Reference",
             "icon": "book",
             "iconType": "light",
             "pages": [
               {
                 "group": "Search",
                 "pages": ["endpoints/reference/search", "endpoints/reference/search/results"]
               },
               {
                 "group": "Browsing",
                 "pages": [
                   "endpoints/reference/browser",
                   "endpoints/reference/browser/content",
                   "endpoints/reference/browser/devices"
                 ]
               },
               { "group": "Reporting", "pages": ["endpoints/reference/usage"] },
               "..."
             ]
           }
         ]
       },
       "..."
     ]
   },
   "..."
   ```

5. **Preview changes**

   Switch to the **Mintlify** root then preview your changes as usual:

   ```shell
   cd ..
   mint dev
   ```

   A local copy of your documentation will be hosted at http://localhost:3000/.

6. **Publish changes**

   Publish your changes after reviewing them:

   ```shell
   git push
   ```

   If you’ve connected your repository to **Mintlify**, your documentation will be automatically
   deployed.

7. **Incorporate updates**

   To incorporate documentation updates later, sync this project again:

   ```shell
   git subtree pull \
   --prefix='[subdirectory/pathname here]' \
   --squash \
   https://github.com/agentfirstdev/whitelabel \
   main
   ```

   Then, repeat the directions from **step 2**.

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
