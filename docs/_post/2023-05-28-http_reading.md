---
title: 图解 HTTP
date: 2023-05-28
author: jianping5
location: ShangHai 
---

## HTTP

> 应用层

生成针对目标 Web 服务器的 HTTP 请求报文

对 Web 服务器请求的内容进行处理，并做出响应

RFC（Request For Comments）：一系列以编号排定的文件，收集了有关互联网相关信息，以及 UNIX 和互联网社区的软件文件。



## IP

> 网络层

搜索对方的地址，一边中转一边传送



## ARP  协议

> 网络层（TCP/IP 四层模型中）

IP -> MAC



## TCP

> 传输层

字节流服务（Byte Stream Service）：将 HTTP 请求报文分割成报文段

三次握手（three-way handshaking）：确保可靠性



## DNS

> 应用层

人类	vs	计算机

ip	<——>	域名



## URI 和 URL

URI（Uniform Resource Identifier）：由某个协议方案表示的资源的定位标识符

URL（Uniform Resource Locator）：资源的地点（互联网上所处的位置）

URL 是 URI 的子集



## HTTP 协议

> HTTP 1.1



无状态（stateless）：协议对于发送过的请求或响应都不做持久化处理

目的：更快地处理大量事务，确保协议的可伸缩性



CGI（Common Gateway Interface）：通用网关接口（若客户端请求的是它，则返回经过执行后的输出结果）

REST（REpresentational State Transfer）：表征状态转移



告知服务器意图的 HTTP 方法：

GET、POST、PUT、HEAD、DELETE、OPTIONS、TRACE、CONNECT



TRACE 方法容易产生：XST（Cross-Site Tracing）：跨站追踪



CONNECT 方法主要用 SSL 和 TLS 协议把通信内容加密后经网络隧道传输

SSL（Secure Sockets Layer）：安全套接层

TLS（Transport Layer Security）：传输层安全



持久连接：减少了 TCP 连接的重复建立和断开所造成的额外开销，减轻了服务器端的负载

管线化（pipelining）：不用等待响应亦可直接发送下一个请求



## HTTP 报文

请求行、状态行、首部字段、其他



通过编码提升传输速率（消耗 CPU 等资源）：内容编码、分块传输编码（Chunked Transfer Coding）

报文：HTTP 通信中的基本单位，由 8 位组字节流（octet sequence）组成，octet 为 8 个比特

实体：请求或响应的有效载荷数据



发送多种数据的多部分对象集合：

邮件采用了：MIME（Multipurpose Internet Mail Extensions）多用途因特网邮件扩展，所以可以处理文本、图片、视频等不同类型的数据

Multipart（多部分对象集合）：容纳多份不同类型的数据



范围请求：指定范围发送的请求，用到首部字段 Range 来指定资源的 byte 范围



内容协商：客户端和服务器端就响应的资源内容进行交涉，然后提供客户端最为适合的资源

判断基准：为请求报文的某些首部字段：Accept-xxx

三种类型：服务器驱动协商、客户端驱动协商、透明协商



## HTTP 状态码

2XX 成功	3XX 重定向	4XX 失败	5XX 服务器错误



## Web 服务器

通信数据转发程序：代理、网关、隧道

**代理**：接受客户端发送的请求后转发给其他服务器

缓存代理（Caching Proxy）、透明代理（Transparent Proxy）不对报文做任何加工

**网关**：能使通信线路上的服务器提供非 HTTP 协议服务

**隧道**：确保客户端和远端的服务器进行安全的通信（SSL：Secure Sockets Layer	公钥加密、私钥解密）

缓存：代理缓存、浏览器缓存	注意有效期



## HTTP 首部

通用首部字段	请求首部字段	响应首部字段	实体首部字段

**通用首部字段**

> 请求报文和响应报文双方都会使用的首部

缓存代理：端到端首部（e2e）	非缓存代理：逐跳首部（hbh）

no-cache：防止从缓存中返回过期的资源（不能缓存过期资源，并不代表不缓存）

no-store：暗示请求或响应中包含机密信息（真正地不进行缓存）

max-age：代表资源保存为缓存的最长时间

Connection：控制不再转发给代理的首部字段、管理持久连接

Transfer-Encoding：规定了传输报文主体时采用的编码方式



**请求首部字段**

> 请求首部字段是从客户端往服务器端发送请求报文中所使用的字段，用于补充请求的附加信息、客户端信息、对响应内容相关的优先级等内容

Accept-xxx

Authorization：用来告知服务器，用户代理的认证信息（比如：JWT）



**响应首部字段**

> 响应首部字段是由服务器端向客户端返回响应报文中所使用的字段，用于补充响应的附加信息、服务器信息，以及对客户端的附加要求等信息

Retry-After：告知客户端应该在多久之后再次发送请求

Server：告知客户端当前服务器上安装的 HTTP 服务器应用程序的信息



**实体首部字段**

> 包含在请求报文和响应报文中的实体部分所使用的首部，用于补充内容的更新时间等与实体相关的信息

Allow：通知客户端能够支持 Request-URI 指定资源的所有 HTTP 方法

Content-Encoding：告知客户端服务器对实体的主体部分选用的内容编码方式（gzip	compress	deflate	identity）

Content-MD5：客户端会对接收的报文主体执行相同的 MD5 算法，然后与首部字段 Content-MD5 的字段值比较（不安全：因为内容被篡改了，那么还可以使用 MD5 算法生成新的值，这时客户端是不知道的）

Content-Type：说明了实体主体内对象的媒体类型



**为 Cookie 服务的首部字段**

Cookie：用户识别及状态管理

HttpOnly：防止跨站脚本攻击（Cross-site scripting，XSS） document.cookie 就无法读取附加 HttpOnly 属性后的 Cookie 的内容了

P3P：The Platform for Privacy Preferences，在线隐私偏好平台，可以让 Web 网站上的个人隐私变成一种仅供程序可理解的形式，以达到保护用户隐私的目的



## HTTPS

**http 的缺点**

- 通信使用明文
- 不验证通信方的身份
- 无法证明报文的完整性

抓包工具：wireshark



SSL（安全套接层）：握手协议、记录协议、警报协议

TLS（安全传输层协议）：记录协议、握手协议



加密、证书、保证完整性



**CA 证书**

包含公私钥对、公钥用户信息、有效期等等

CA 证书需要操作系统内置的公钥解开

公钥加密后只有对应的私钥才可以解密（保证数据只能由私钥持有者收到）

私钥加密后只有对应的公钥才可以解密（保证数据是由私钥持有者发出）

> CA（Certification Authority）认证中心，采用 PKI（Public Key Infrastructure）公开密钥基础架构技术，专门提供网络身份认证服务



DDoS（Distributed Denial of Service）：分布式拒绝服务攻击

数百、数千台电脑发动攻击，伪装大量请求发送给服务端，服务端充斥着大量需要恢复的消息，占用网络带宽和系统资源，以至于服务端瘫痪



MITM（Man-in-the-Middle attack）中间人攻击



HTTP + 加密 + 认证 + 完整性保护 -> HTTPS



HTTPS：身披 SSL 外壳的 HTTP

> 通常 HTTP 直接和 TCP 通信，当使用 SSL 时，则会先和 SSL 通信，然后再由 SSL 和 TCP 通信



**加密技术**

共享密钥加密（问题：如何将密钥安全的发送给对方，因为双方都需要密钥）

公开密钥加密：使用非对称的密钥

混合加密机制（HTTPS 使用）：在交换密钥环节使用公开密钥加密的方式，之后的建立通信交换报文阶段则使用共享密钥加密方式



证明公开密钥正确性的证书：CA 和其相关机关颁发的公开密钥证书

可证明组织真实性的 EV SSL 证书：确认对方服务器背后运营的企业是否真实存在（EV SSL 证书 Extended Validation SSL Certificate）

用以确认客户端的客户端证书：证明服务器正在通信的对方始终是预料之内的客户端



自签名证书：由自认证机构颁发的证书（OpenSSL）



SSL

通信慢、大量消耗 CPU 及 内存等资源，导致处理速度变慢（因为需要加密处理）



## 认证

**BASIC 认证**

HTTP/1.0

采用 Base64 编码（用户名和密码）

不安全，不灵活



**DIGEST 认证**

HTTP/1.1

质询响应方式（不直接发送密码，而是发送摘要及由质询码计算得出的响应码）

防止密码被窃听，但是并没有防止用户伪装



**SSL 客户端认证**

双因素认证：SSL 客户端证书（认证客户端计算机）和密码（确定是用户本人的行为）



**基于表单认证**

服务器端保存密码：加盐值（随机生成） -> 散列函数





## 功能追加协议

HTTP 存在一些限制



SNS（Social Networking Service）社交网络服务

SDPY（解决 HTTP 的性能瓶颈，缩短 Web 页面的加载时间 50%）



Ajax（Asynchronous JavaScript and XML）：实现局部更新

有效利用 JavaScrpit 和 DOM（Document Object Model）文档对象模型



Comet 延迟应答



SPDY 介于 TCP（SSL）和 HTTP 之间

- 多路复用流
- 赋予请求优先级
- 压缩 HTTP 首部
- 推送功能
- 服务器提示功能



WebSocket（全双工）

- 推送功能
- 减少通信量



HTTP/2.0

改善用户在使用 Web 时的速度体验

WebDAV（Web-based Distributed Authoring and Versioning）基于万维网的分布式创作和版本控制



## 构建 Web 内容

HTML（HyperText Markup Language）超文本标记语言

超链接（建立关联） 标签（修饰文档）



CSS（Cascading Style Sheets）层叠样式表

设计



JavaScript	DOM（用以操作 HTML 和 XML 文档的 API）

> DOM 与 ORM 的设计思想有异曲同工之妙



CGI（Common Gateway Interface）通用网关接口

Web 服务器在接受到客户端发送过来的请求后转发给程序的一组机制（每次接收到请求，程序都要启动一次）



Servlet（能在服务器上创建动态内容的程序）运行在与 Web 服务器相同的进程中



XML（eXtensible Markup Language）可扩展标记语言：可按应用目标进行扩展的通用标记语言

从 SGML（Standard Generalized Markup Language）简化而成



RSS/Atom（都用到了 XML）

RSS（简易信息聚合，聚合内容）



JSON（JavaScript Object Notation）以 JavaScript 的对象表示法为基础的轻量级数据标记语言



## Web 的攻击技术

SSH 具备协议级别的认证及会话管理等功能



主动攻击：直接访问 Web 应用，传入攻击代码（SQL 注入和 OS 命令注入攻击）

被动攻击：利用圈套策略执行攻击代码（跨站脚本攻击和跨站点请求伪造）



**输出值转义不完全引发安全漏洞**

客户端允许关闭 JavaScript，所以不建议将 JavaScript 验证作为安全的防范对策，保留客户端验证只是为了尽早地辨识输入错误，提高 UI 体验



XSS 跨站脚本攻击

通过存在安全漏洞的 Web 网站注册用户的浏览器运行非法的 HTML 标签或 JavaScript 进行的一种攻击



SQL 注入（SQL Injection）针对 Web 应用使用的数据库，通过运行非法的 SQL 而产生的攻击（破坏 SQL 语句结构）

SQL 指用来操作关系型数据库管理系统（Relational DataBase Management System，RDBMS）的数据库语言



OS 命令注入攻击：通过 Web 应用，执行非法的操作系统命令（调用 Shell）

> 调用 Shell 时存在疏漏，就可以执行插入的非法 OS 命令



HTTP 首部注入攻击

攻击者通过在响应首部字段内插入换行，添加任意响应首部或主体的一种攻击

HTTP 响应截断攻击（HTTP Response Splitting Attack）



邮件首部注入攻击（Mail Header Injection）



目录遍历攻击（Directory Traversal）

指对本无意公开的文件目录，通过非法截断其目录路径后，达成访问目的的一种攻击



远程文件包含漏洞（Remote File Inclusion）

指当部分脚本内容需要从其他文件读入时，攻击者利用指定外部服务器的 URL 充当依赖文 件，让脚本读取之后，就可运行任意脚本的一种攻击



**因设置或设计上的缺陷引发的安全漏洞**

强制浏览（Forced Browsing）

从安置在 Web 服务器的公开目录下的文件中，浏览那些原本非自愿公开的文件



不正确的错误消息处理（Error Handling Vulnerability）

Web 应用的错误信息内包含对攻击者有用的信息

> 抛给客户端的错误信息不要太过详细



开放重定向（Open Redirect）

对指定的任意 URL 作重定向跳转的功能



**因会话管理疏忽引发的安全漏洞**

会话劫持（Session Hijack）

指攻击者通过某种手段拿到了用户的会话 ID，并非法使用此会话 ID 伪装成用户，达到攻击的目的

> 防止 XSS 攻击，将 Cookie 设置为 HttpOnly



会话固定攻击（Session Fixation）

会强制用户使用攻击者指定的会话 ID，属于被动攻击



Session Adoption

是指 PHP 或 ASP.NET 能够接收处理未知会话 ID 的功能



跨站点请求伪造

CSRF（Cross-Site Request Forgeries）

指攻 击者通过设置好的陷阱，强制对已完成认证的用户进行非预期的个人信息或设定信息等某些状态更新，属于被动攻击



**其他安全漏洞**

密码破解（Password Cracking）

通过网络的密码试错：穷举法、字典法

通过加密过的数据导出明文：穷举法+字典法、彩虹表、拿到密钥、加密算法的漏洞

> Free Rainbow Tables：彩虹表网站

点击劫持（Clickjacking）

指利用透明的按钮或链接做成陷阱，覆盖在 Web 页面之上。然后诱使用户在不知情的情况下，点击那个链接访问内容的一种攻击手段。这种行为又称为界面伪装（UI Redressing）



DoS 攻击

Denial of Service attack

让运行中的服务呈停止状态的攻击

- 集中利用访问请求造成资源过载，资源用尽的同时，实际上服务也就呈停止状态
- 通过攻击安全漏洞使服务停止。

DDoS（Distributed Denial of Service attack）

多台计算机发起的 DoS 攻击



后门程序（Backdoor）

指开发设置的隐藏入口，可不按正常步骤使用受限功能

> 监视进程和通信发现被植入的后门程序
