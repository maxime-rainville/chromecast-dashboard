import { networkInterfaces, NetworkInterfaceInfo } from 'os';

const ifaces = networkInterfaces();
const ifnames = Object.keys(ifaces);

const IPs = ifnames
  .reduce((accu: NetworkInterfaceInfo[], ifname) => accu.concat(<NetworkInterfaceInfo[]>ifaces[ifname]), [])
  .filter(iface => 'IPv4' === iface.family && iface.internal === false )
  .map( (iface) => iface.address);


export default IPs;