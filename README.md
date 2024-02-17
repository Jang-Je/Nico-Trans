# 니코니코 동화 번역기

## 원 제작자에 관하여

저는 이 프로그램의 제작자가 아닙니다! 원작자분이 프로그램의 업데이트를 멈추셔서 대신한 것입니다.

[기존 프로그램 보러가기](https://github.com/009342/Nico-Nico-Video-Translator)

## 사용법

1. node.js와 OpenSSL의 설치가 선행되어야 합니다.

윈도우용 OpenSSL의 설치는 다음 링크의 Download Win32 OpenSSL을 참고해주세요.

https://slproweb.com/products/Win32OpenSSL.html

node.js의 설치는 다음 링크를 참고해주세요.

https://nodejs.org/ko/

2. 메모장을 관리자 권한으로 실행합니다.

3. 파일->열기를 눌러 파일이름 항목에 C:\Windows\System32\drivers\etc\hosts 를 적고 열기를 눌러주세요. 

4. 맨 아래줄에 127.0.0.1 nv-comment.nicovideo.jp를 추가해주세요. 추가하면 다음과 같이 되어야 합니다.
<pre><code># Copyright (c) 1993-2009 Microsoft Corp.
#
# This is a sample HOSTS file used by Microsoft TCP/IP for Windows.
#
# This file contains the mappings of IP addresses to host names. Each
# entry should be kept on an individual line. The IP address should
# be placed in the first column followed by the corresponding host name.
# The IP address and the host name should be separated by at least one
# space.
#
# Additionally, comments (such as these) may be inserted on individual
# lines or following the machine name denoted by a '#' symbol.
#
# For example:
#
#      102.54.94.97     rhino.acme.com          # source server
#       38.25.63.10     x.acme.com              # x client host

# localhost name resolution is handled within DNS itself.
#	127.0.0.1       localhost
#	::1             localhost

127.0.0.1 nv-comment.nicovideo.jp
기타 사용자가 추가한 구문들...</pre></code>

5. https://github.com/Jang-Je/Nico-Trans/releases 에서 니코니코 동화 번역기를 다운받아주세요.

6. 다운받은 파일의 압축을 풀어주고 cert폴더 내의 cert.bat를 관리자권한으로 실행시켜 주세요.

7. 정상적으로 인증서가 설치되면 다음과 같이 출력되어야 합니다.
<pre><code>관리자 권한으로 실행해야 인증서가 설치됩니다!
계속하려면 아무 키나 누르십시오 . . .
개인키를 생성하는 중입니다...
Generating RSA private key, 2048 bit long modulus
.................+++
..................+++
e is 65537 (0x010001)
인증서 서명 요청 파일을 생성하는 중입니다...
인증서를 서명하는 중입니다...
Signature ok
subject=C = KR, CN = sshbrain.tistory.com, emailAddress = 009342@naver.com, O = NA, OU = NA, L = NA
Getting Private key
Root "신뢰할 수 있는 루트 인증 기관"
서명이 공개 키와 일치합니다.
"sshbrain.tistory.com" 인증서가 저장소에 추가되었습니다.
CertUtil: -addstore 명령이 성공적으로 완료되었습니다.
계속하려면 아무 키나 누르십시오 . . .
</pre></code>

8. 다운받은 파일의 run.bat를 실행시켜 주시면 자동으로 동영상 열람시 번역이 됩니다.

9. 한 번만 실행시켜 놓으면 컴퓨터나 프로그램이 꺼지지 않는한 자동 번역이 이뤄집니다.

10. 추후 번역 기능을 사용하고 싶지 않으시다면, 2-4 과정을 반복하되, 맨 아래줄에 추가한 것들만 삭제해주시면 됩니다.

## 기존 프로그램에 추가&변경 된 기능

- 니코니코동화의 변경된 api에 맞추어 프로그램을 변경했습니다.
- 안정적인 지원을 위해 C#은 버렸습니다.(사실 제가 쓸 줄 모릅니다.)
- 간편 코멘트는 나름대로 의역을 했습니다만 정확하지 않습니다.대신 niconico_dictionary.json을 열어 마음껏 수정하실 수 있습니다.
- 번역된 문장을 원어와도 비교할 수 있도록 콘솔창에 두 언어를 같이 출력할 수 있도록 변경했습니다.(data.json의 isStudy를 0으로 두면 콘솔 출력을 끌 수 있습니다.)
- 번역기 2개를 더 추가해 원하는 번역기를 선택할 수 있습니다.(data.json의 translator의 숫자를 변경해 번역기를 바꿀 수 있습니다. 0: 번역 안함, 1: 파파고, 2: DeepL, 3: Google번역)

## 오류 제보
깃허브의 issues란으로 부탁드립니다.

## 주의 사항

- 플래시 플레이어를 지원하지 않습니다. 이 버그는, 플래시 플레이어가 간헐적으로 작동하는 관계로 잠시 후 다시 시도해주시거나 새로 고침을 눌러 HTML5 플레이어로 영상을 시청해주시기 바랍니다.
- Chrome이나 Whale등의 브라우저에서 페이지 번역 기능을 쓴 채 접속할 때 간헐적인 무한 재로딩 현상이 발생합니다. 이때는 빠르게 프로그램을 끄고 재시작하세요. 번역기로부터 IP밴을 먹을 수도 있습니다.

## 참고
[번역기 코드 참고](https://github.com/009342/Nico-Nico-Video-Translator)