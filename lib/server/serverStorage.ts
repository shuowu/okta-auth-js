/*!
 * Copyright (c) 2018-present, Okta, Inc. and/or its affiliates. All rights reserved.
 * The Okta software accompanied by this notice is provided pursuant to the Apache License, Version 2.0 (the "License.")
 *
 * You may obtain a copy of the License at http://www.apache.org/licenses/LICENSE-2.0.
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *
 * See the License for the specific language governing permissions and limitations under the License.
 *
 */

import storageBuilder from '../storageBuilder';
import { CACHE_STORAGE_NAME } from '../constants';
const NodeCache = require('node-cache'); // commonJS module cannot be imported without esModuleInterop
var storage = new NodeCache();

// Building this as an object allows us to mock the functions in our tests
var storageUtil = {

  getHttpCache() {
    return storageBuilder(storageUtil.getStorage(), CACHE_STORAGE_NAME);
  },

  getStorage() {
    return {
      getItem: storageUtil.storage.get,
      setItem: function(key, value) {
        storageUtil.storage.set(key, value, '2200-01-01T00:00:00.000Z');
      }
    };
  },

  storage: {
    set: function(name, value, expiresAt) {
      // eslint-disable-next-line no-extra-boolean-cast
      if (!!(Date.parse(expiresAt))) {
        // Time to expiration in seconds
        var ttl = (Date.parse(expiresAt) - Date.now()) / 1000;
        storage.set(name, value, ttl);
      } else {
        storage.set(name, value);
      }

      return storageUtil.storage.get(name);
    },

    get: function(name) {
      return storage.get(name);
    },

    delete: function(name) {
      return storage.del(name);
    }
  }
};

export default storageUtil;
