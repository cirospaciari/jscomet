import { httpGet, httpPost, httpRequest } from 'jscomet.decorators';


class HttpBinService{

    @httpGet("@settings:httpBinUrl/get?s={0}")
    sampleGet(search){
      //loga erro caso ocorra (so cai aqui se der erro)
      //console.error("Error: HttpBinService.sampleGet", httpRequest.getLastError());
      return {};
    }

    @httpGet("@settings:httpBinUrl/get?name={name}&surname={surname}")
    sampleGetNamedParameters(user){
      //loga erro caso ocorra (so cai aqui se der erro)
      //console.error("Error: HttpBinService.sampleGetNamedParameters", httpRequest.getLastError());
      return {};
    }

    @httpPost("@settings:httpBinUrl/post")
    samplePost(user){
      //loga erro caso ocorra (so cai aqui se der erro)
      //console.error("Error: HttpBinService.samplePost", httpRequest.getLastError());
      return {};
    }
}

export default HttpBinService;
