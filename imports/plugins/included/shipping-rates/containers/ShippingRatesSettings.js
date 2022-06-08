import { Meteor } from "meteor/meteor";
import { composeWithTracker } from "@reactioncommerce/reaction-components";
import { Shipping } from "/lib/collections";
import Statics from "/plugins/client/utils/statics.js";
import ShippingRatesSettings from "../components/ShippingRatesSettings";
import decodeOpaqueId from "@reactioncommerce/api-utils/decodeOpaqueId.js";
import { Reaction } from "/client/api";
/**
 * @param {Object} props Props from parent
 * @param {Function} onData Callback
 * @returns {undefined}
 */
function composer(props, onData) {
  Reaction.shopId = { ...decodeOpaqueId(props.match.params.shopId) }.id || Reaction.shopId;
  Meteor.subscribe("Shipping");
  const statics = new Statics(props);
  onData(null, {
    fulfillmentMethods: [],
    statics,
    shopId: Reaction.shopId,
  });
}

export default composeWithTracker(composer)(ShippingRatesSettings);
