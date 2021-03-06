import getChannels from '../../cache/lib/getChannels'
import Config from '../../config'
import { DDP } from 'meteor/ddp'
import { _ } from 'meteor/underscore'

/**
 * @param collection
 * @param _config
 * @param mutationObject
 */
export default function (collection, _config) {
  const collectionName = collection._name

  if (!_config || typeof _config == 'function') _config = { }

  const defaultOverrides = {};
  if (!DDP._CurrentMethodInvocation.get()) {
    // If we're not in a method, then we should never need to do optimistic
    // ui processing.
    //
    // However, we allow users to really force it by explicitly passing
    // optimistic: true if they want to use the local-dispatch code path
    // rather than going through Redis.
    defaultOverrides.optimistic = false
  }

  const config = _.extend({}, Config.mutationDefaults, defaultOverrides, _config)

  config._channels = getChannels(collectionName, config)

  return config
}
