/** @brief Functions which transform data from various sources to Influx
 *  @date 2020-01-01
 *  @author Otso Jousimaa <otso@ojousima.net>
 *
 */

import { RuuviData } from './ruuvidata';

/** @brief definition of transform functions which produce unifrom Ruuvi Data objects. */
export interface ITransform {
  (source: any): RuuviData;
}
/*
export const mqtt2ruuvi: ITransform = function(source: mqttInput) {
  let rData: RuuviData;

  return rData;
};
*/
