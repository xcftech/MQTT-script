/** @brief Raw Ruuvi data definition
 *  @date 2020-01-01
 *  @author Otso Jousimaa <otso@ojousima.net>
 *
 */

/** @brief definition of a Ruuvi Data object to store */
export class RuuviData {
  coordinates: string; //!< Coordinate string
  deviceId: string; //!< e.g. MAC address
  gatewayId: string; //!< e.g. MAC address
  providerId: string; //!< Provider of the data
  rawData: string; //!< Hex-encoded binary payload
  rssi: number; //!< RSSI of device
  timestamp: number; //!< Unix timestamp, epoch

  constructor(
    coordinates: string,
    deviceId: string,
    gatewayId: string,
    providerId: string,
    rawData: string,
    rssi: number,
    timestamp: number,
  ) {
    this.coordinates = coordinates;
    this.deviceId = deviceId;
    this.gatewayId = gatewayId;
    this.providerId = providerId;
    this.rawData = rawData;
    this.rssi = rssi;
    this.timestamp = timestamp;
  }
}
