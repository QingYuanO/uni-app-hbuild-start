import alovaInst from "..";

export function loginCustomer(data: AipRequest["useLoginCustomer"]) {
  return alovaInst.Post<AipResponse["useLoginCustomer"]>("/bo/tmsRelated/loginCustomer", data);
}
