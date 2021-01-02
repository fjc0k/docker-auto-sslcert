# docker-auto-sslcert

自动生成、续期 SSL 证书并发布通知。

## 环境变量

| 变量名称       | 说明                                               | 示例                                                                                                                                                                                                                        |
| -------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DNSPOD_API_KEY | DNSPod 的鉴权信息，格式：ID,Token                  | 10086,dsdwkkd3k2493242940329                                                                                                                                                                                                |
| DOMAIN_LIST    | 要生成证书的域名列表，支持泛域名                   | foo.bar,\*.x.qq.com                                                                                                                                                                                                         |
| NOTIFY_URL     | 证书更新时的通知地址，可以为一个字符串或 JSON 对象 | https://foo.bar/sslcert-update<br /><br />{<br />&nbsp;&nbsp;&nbsp;&nbsp;"foo.bar": "https://foo.bar/sslcert-update/foo.bar",<br />&nbsp;&nbsp;&nbsp;&nbsp;"\*.x.qq.com": "https://foo.bar/sslcert-update/.x.qq.com"<br />} |

## 通知地址收到的参数

通知地址收到的是一个 POST 请求，请求体为一个 JSON 字符串，内容为：

```json
{
  "domain": "foo.bar",
  "crt": "证书内容",
  "key": "证书私钥"
}
```

## 许可

MIT (c) Jay Fong
