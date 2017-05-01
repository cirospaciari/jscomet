import { httpGet, httpPost, httpRequest } from 'jscomet.decorators';


class HttpBinService{

    @httpGet("@settings:httpBinUrl/get?s={0}")
    sampleGet(search){
      //only call function body if a error occur
      //console.error("Error: HttpBinService.sampleGet", httpRequest.getLastError());
      return {}; //value returned if a error occur
    }

    @httpGet("@settings:httpBinUrl/get?name={name}&surname={surname}")
    sampleGetNamedParameters(user){
      //only call function body if a error occur
      //console.error("Error: HttpBinService.sampleGetNamedParameters", httpRequest.getLastError());
      return {}; //value returned if a error occur
    }

    @httpPost("@settings:httpBinUrl/post")
    samplePost(user){
      //only call function body if a error occur
      //console.error("Error: HttpBinService.samplePost", httpRequest.getLastError());
      return {}; //value returned if a error occur
    }
}

export default HttpBinService;
