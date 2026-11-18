// Xpress9 çözücüsü (yalnızca açma). tools/xpress9/build.sh ile üretilmiştir; elle düzenlemeyin.
// Kaynak: Copyright (c) Microsoft Corporation, MIT License. https://github.com/Hugoberry/xpress9-python

  var bufferView;
  var base64ReverseLookup = new Uint8Array(123/*'z'+1*/);
  for (var i = 25; i >= 0; --i) {
    base64ReverseLookup[48+i] = 52+i; // '0-9'
    base64ReverseLookup[65+i] = i; // 'A-Z'
    base64ReverseLookup[97+i] = 26+i; // 'a-z'
  }
  base64ReverseLookup[43] = 62; // '+'
  base64ReverseLookup[47] = 63; // '/'
  /** @noinline Inlining this function would mean expanding the base64 string 4x times in the source code, which Closure seems to be happy to do. */
  function base64DecodeToExistingUint8Array(uint8Array, offset, b64) {
    var b1, b2, i = 0, j = offset, bLength = b64.length, end = offset + (bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '=');
    for (; i < bLength; i += 4) {
      b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
      b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
      uint8Array[j++] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
      if (j < end) uint8Array[j++] = b1 << 4 | b2 >> 2;
      if (j < end) uint8Array[j++] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
    }
  }
function initActiveSegments(imports) {
  base64DecodeToExistingUint8Array(bufferView, 1024, "RmxhZ3NSZXNlcnZlZElzTm9uWmVybz0weCVJeABwRGVjb2Rlci0+bV91TWFnaWM9MHglSXggZXhwZWN0aW5nIDB4JUl4AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgaT0lSXUgZW50cnlDb3VudD0lSXUAQXNzZXJ0ICVzIGZhaWxlZCBpbiAlcyAoJXMgJXUpLCB1TXRmRW50cnlDb3VudD0lSXUAQXNzZXJ0ICVzIGZhaWxlZCBpbiAlcyAoJXMgJXUpLCB1U3ltYm9sPSVJdSB1VGFibGVPZmZzZXQ9JUl1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgdVJvb3RCaXRzPSVJdSB1VGFpbEJpdHM9JUl1AEVuY29kZWRTaXplQml0cz0lSXUgSHVmZm1hblRhYmxlQml0cz0lSXUAQXNzZXJ0ICVzIGZhaWxlZCBpbiAlcyAoJXMgJXUpLCB1T3JpZ0RhdGFTaXplPSVJdSBPcmlnU2l6ZT0lSTY0dSBCbG9ja0NvcGllZEJ5dGVzPSVJdQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIHVEZWNvZGVQb3NpdGlvbj0lSXUgdVN0b3BQb3NpdGlvbj0lSXUgdUVuZE9mQnVmZmVyPSVJdQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIERlY29kZVBvc2l0aW9uPSVJdSBDb3B5UG9zaXRpb249JUl1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgdVN5bWJvbD0lSXUAQXNzZXJ0ICVzIGZhaWxlZCBpbiAlcyAoJXMgJXUpLCB1UHRyTWluTWF0Y2hMZW5ndGg9JUl1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgdU10Zk1pbk1hdGNoTGVuZ3RoPSVJdQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIHVUYWJsZU9mZnNldD0lSXUgaT0lSXUgdURlY29kZVRhYmxlU2l6ZT0lSXUAQnVmZmVyIHRvbyBzbWFsbCB0byBEaXJlY3REZWNvZGUsIHVCeXRlc05lZWRlZD0lSXUsIHVCeXRlc1RvQ29weT0lSXUsIHVEZWNvZGVQb3NpdGlvbj0lSXUsIHVCdWZmZXJEYXRhU2l6ZT0lSXUAQ29tcERhdGE9JXAgQXR0YWNoZWRDb21wRGF0YT0lcCBDb21wRGF0YVNpemU9JXUgQXR0YWNoZWRDb21wRGF0YVNpemU9JUl1AE10ZkVudHJ5Q291bnQ9JUl1IEV4cGVjdGVkPSVJdQBQdHJNaW5NYXRjaExlbmd0aD0lSXUgRXhwZWN0ZWQ9JUl1AE10Zk1pbk1hdGNoTGVuZ3RoPSVJdSBFeHBlY3RlZD0lSXUAQmxvY2tXaW5kb3dzU2l6ZUxvZzI9JUl1IEV4cGVjdGVkPSVJdQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIHVCeXRlc05lZWRlZD0lSXUgU2NyYXRjaEJ5dGVzU3RvcmVkPSVJdQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIE51bWJlck9mQml0c0ZldGNoZWQ9JUl1AFVzZXJEYXRhU2l6ZT0lSXUgVXNlckRhdGFSZWFkPSVJdQBIZWFkZXJDcmMzMj0ldSBFeHBlY3RlZEhlYWRlckNyYzMyPSVJdQBEZWNvZGVkQnl0ZXM9JUl1IEVuY29kZWRCeXRlcz0lSTY0dSBUYWlsTGVuZ3RoPSVJdSBEZWNvZGVkQml0cz0lSXUgRW5jb2RlZEJpdHM9JUl1IENvcGllZEJ5dGVzPSVJdSBCbG9ja0J5dGVzPSVJNjR1AGk9JXUgaVN5bWJvbD0ldSB1QWxwaGFiZXRTaXplPSV1IHVGaWxsQm91bmRhcnk9JXUAQmxvY2tJbmRleD0ldSBFeHBlY3RlZEJsb2NrSW5kZXg9JXUAdURlY29kZVBvc2l0aW9uPSV1IHVCdWZmZXJPZmZzZXQ9JUk2NHUgaU9mZnNldD0ldQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIEV4Y2Vzc2l2ZWx5TGFyZ2VCaXRMZW5ndGg6IHN5bWJvbD0ldSBiaXRzPSV1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgcE5vZGUtPm1fdUJpdHM9JXUASHVmZm1hblRhYmxlQml0cz0ldSBEZWNvZGVkSHVmZm1hblRhYmxlQml0cz0ldQB1RGVjb2RlUG9zaXRpb249JXUAaT0ldSBuPSV1AGk9JXUgaVN5bWJvbD0ldSB1TWF4Q29kZXdvcmRMZW5ndGg9JXUAaT0ldSBpU3ltYm9sPUhVRkZNQU5fRU5DT0RFRF9UQUJMRV9ST1dfMSBMZW5ndGg9JXUAVW5rbm93bkh1ZmZtYW5UYWJsZUVuY29kaW5nPSV1AHVNc2I9JXUgTWF4V2luZG93U2l6ZT0ldQBTZXNzaW9uU2lnbmF0dXJlPSV1IEV4cGVjdGVkU2Vzc2lvblNpZ25hdHVyZT0ldQBBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIG1fdU10ZkVudHJ5Q291bnQ9JUl1IGV4cGVjdGVkPSV1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgbV91UHRyTWluTWF0Y2hMZW5ndGg9JUl1IGV4cGVjdGVkPSV1AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgbV91TXRmTWluTWF0Y2hMZW5ndGg9JUl1IGV4cGVjdGVkPSV1AEhlYWRlck1hZ2ljPSV1IEV4cGVjdGVkTWFnaWM9JXUAbj0ldSBDb3VudFswXT0ldQB1U3ltYm9sIDwgdVRhYmxlT2Zmc2V0AEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgQmFkU3RhdHVzAHVSb290Qml0cyA+PSA0ICYmIHVUYWlsQml0cyA+PSA0ICYmIHVSb290Qml0cyA8PSAxNSAmJiB1VGFpbEJpdHMgPD0gMTUgJiYgdVJvb3RCaXRzID49IHVUYWlsQml0cwBIdWZmbWFuRGVjb2RlU29ydFN5bWJvbHMASHVmZm1hbkRlY29kZUZpbGxUYWJsZXMASHVmZm1hbkNyZWF0ZURlY29kZVRhYmxlcwB1RGVjb2RlUG9zaXRpb24gPCB1U3RvcFBvc2l0aW9uICYmIHVTdG9wUG9zaXRpb24gPD0gdUVuZE9mQnVmZmVyAEFzc2VydCAlcyBmYWlsZWQgaW4gJXMgKCVzICV1KSwgQmlvU3RhdGVQdHI9JXAgU2NyYXRjaFN0YXJ0PSVwIFNjcmF0Y2hFbmQ9JXAAcERlY29kZXItPm1fRGVjb2RlRGF0YS5tX3VEZWNvZGVQb3NpdGlvbiA9PSBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdUNvcHlQb3NpdGlvbgAoeGludCkgdVN5bWJvbCA9PSAoSFVGRk1BTl9ERUNPREVfVEFCTEVfRU5UUlkpIHVTeW1ib2wAc3JjL2luY2x1ZGUvWHByZXNzOUx6NzdEZWMuaQBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdUJsb2NrQ29waWVkQnl0ZXMgPCBwRGVjb2Rlci0+bV9TdGF0Lm1fQmxvY2subV91T3JpZ1NpemUAdVRhYmxlT2Zmc2V0ICsgaSA8PSB1RGVjb2RlVGFibGVTaXplAHBEZWNvZGVyLT5tX1VzZXJEYXRhLm1fdVVzZXJEYXRhUmVhZCA8PSBwRGVjb2Rlci0+bV9Vc2VyRGF0YS5tX3VVc2VyRGF0YVNpemUAWHByZXNzOURlY29kZVN0YXRlAEh1ZmZtYW5EZWNvZGVMZW5ndGhUYWJsZQB1Qnl0ZXNOZWVkZWQgPiBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdVNjcmF0Y2hCeXRlc1N0b3JlZABBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIEh1ZmZtYW5EZWNvZGVGaWxsVGFibGVzIGZhaWxlZABBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIEh1ZmZtYW5EZWNvZGVWZXJpZnlUcmVlIGZhaWxlZABBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIEJ1ZmZlciBvdmVycnVuISBtX3VVc2VyRGF0YVJlYWQgPSAlZCwgbV91VXNlckRhdGFTaXplID0gJWQAWHByZXNzOURlY29kZXJHZXRQcm9jAHNyYy9zcmMvWHByZXNzOURlY0h1ZmZtYW4uYwBzcmMvc3JjL1hwcmVzczlEZWNMejc3LmMAWHByZXNzOURlY29kZXJGZXRjaERlY29tcHJlc3NlZERhdGEAdU1heFdpbmRvd1NpemVMb2cyPSVJdSBpcyBvdXQgb2YgcmFuZ2UgWyV1Li4ldV0AbiA8IEhVRkZNQU5fQ09ERVdPUkRfTEVOR1RIX0xJTUlUAHBEZWNvZGVySXNOVUxMAHBOb2RlLT5tX3BOZXh0ID09IE5VTEwAcExlYWYgIT0gTlVMTABwU3RhdHVzLT5tX3VTdGF0dXMgPT0gWHByZXNzOVN0YXR1c19PSwBwU3RhdHVzLT5tX3VTdGF0dXMgIT0gWHByZXNzOVN0YXR1c19PSwBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdVB0ck1pbk1hdGNoTGVuZ3RoID09IExaNzdfUFRSX01JTl9NQVRDSF9MRU5HVEgAcERlY29kZXItPm1fRGVjb2RlRGF0YS5tX3VNdGZNaW5NYXRjaExlbmd0aCA9PSBMWjc3X01URl9NSU5fTUFUQ0hfTEVOR1RIAHBEZWNvZGVyLT5tX0RlY29kZURhdGEubV91TXRmRW50cnlDb3VudCA9PSBMWjc3X01URgBYcHJlc3M5THo3N0RlY19NdGZDb3VudDBfUHRyNABwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdU10ZkVudHJ5Q291bnQgPT0gNABwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdVB0ck1pbk1hdGNoTGVuZ3RoID09IDQAWHByZXNzOUx6NzdEZWNfTXRmQ291bnQwX1B0cjMAWHByZXNzOUx6NzdEZWNfTXRmQ291bnQ0X1B0cjRfTXRmMwBYcHJlc3M5THo3N0RlY19NdGZDb3VudDJfUHRyNF9NdGYzAFhwcmVzczlMejc3RGVjX010ZkNvdW50NF9QdHIzX010ZjMAWHByZXNzOUx6NzdEZWNfTXRmQ291bnQyX1B0cjNfTXRmMwBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdU10Zk1pbk1hdGNoTGVuZ3RoID09IDMAWHByZXNzOUx6NzdEZWNfTXRmQ291bnQ0X1B0cjRfTXRmMgBYcHJlc3M5THo3N0RlY19NdGZDb3VudDJfUHRyNF9NdGYyAFhwcmVzczlMejc3RGVjX010ZkNvdW50NF9QdHIzX010ZjIAWHByZXNzOUx6NzdEZWNfTXRmQ291bnQyX1B0cjNfTXRmMgBpPSV1IHVGaWxsQm91bmRhcnk9JXUgaVN5bWJvbD1IVUZGTUFOX0VOQ09ERURfVEFCTEVfUk9XXzEAQklPUkRfVEVMTF9PVVRQVVRfUFRSX1NUQVRFIChwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fQmlvU3RhdGUpIDw9IHBEc3QgKyBwRGVjb2Rlci0+bV9EZWNvZGVEYXRhLm1fdVNjcmF0Y2hCeXRlc1N0b3JlZCArIHNpemVvZiAoQklPX0ZVTEwpIC0gMQBpPSV1IHVGaWxsQm91bmRhcnk9JXUgaVN5bWJvbD1IVUZGTUFOX0VOQ09ERURfVEFCTEVfUk9XXzAAaT0ldSBpU3ltYm9sPUhVRkZNQU5fRU5DT0RFRF9UQUJMRV9ST1dfMCBMZW5ndGg9MABSZXNlcnZlZFZhbHVlPSV1IEV4cGVjdGVkVmFsdWU9MAAodUJ5dGVzTmVlZGVkICYgNykgPT0gMABBc3NlcnQgJXMgZmFpbGVkIGluICVzICglcyAldSksIFNvcnRPcmRlclZpb2xhdGlvbjogQ3VycmVudD0oJXUgJXUpIE5leHQ9KCV1ICV1KQBwTm9kZS0+bV91Qml0cyA+IHBOb2RlLT5tX3BOZXh0LT5tX3VCaXRzIHx8IChwTm9kZS0+bV91Qml0cyA9PSBwTm9kZS0+bV9wTmV4dC0+bV91Qml0cyAmJiBwTm9kZS0+bV91U3ltYm9sID4gcE5vZGUtPm1fcE5leHQtPm1fdVN5bWJvbCkAcERzdCArIHBEZWNvZGVyLT5tX0RlY29kZURhdGEubV91U2NyYXRjaEJ5dGVzU3RvcmVkID49IEJJT1JEX1RFTExfT1VUUFVUX1BUUl9TVEFURSAocERlY29kZXItPm1fRGVjb2RlRGF0YS5tX0Jpb1N0YXRlKQBpID49ICgoKHV4aW50KSAxKSA8PCAodUxlYWZMZXZlbCAtIHVCaXRzKSkAQXNzZXJ0ICVzIGZhaWxlZCBpbiAlcyAoJXMgJXUpLCA=");
  base64DecodeToExistingUint8Array(bufferView, 6144, "AQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAQAAAAAAAAACAAAAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAABAAAAAAAAAAIAAAAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgAAAAAAAAAEAAAAAAAAAAgA==");
  base64DecodeToExistingUint8Array(bufferView, 6664, "AQAAAAAAAAADAAAAAAAAAAcAAAAAAAAADwAAAAAAAAAfAAAAAAAAAD8AAAAAAAAAfwAAAAAAAAD/AAAAAAAAAP8BAAAAAAAA/wMAAAAAAAD/BwAAAAAAAP8PAAAAAAAA/x8AAAAAAAD/PwAAAAAAAP9/AAAAAAAA//8AAAAAAAD//wEAAAAAAP//AwAAAAAA//8HAAAAAAD//w8AAAAAAP//HwAAAAAA//8/AAAAAAD//38AAAAAAP///wAAAAAA////AQAAAAD///8DAAAAAP///wcAAAAA////DwAAAAD///8fAAAAAP///z8AAAAA////fwAAAAAAIBAwCCgYOAQkFDQMLBw8AiISMgoqGjoGJhY2Di4ePgEhETEJKRk5BSUVNQ0tHT0DIxMzCysbOwcnFzcPLx8/");
  base64DecodeToExistingUint8Array(bufferView, 7172, "A4Nr8vdwO+H081ATH5eaxxwU8TXo56Em62TK1M9Y2YrM27J4OCjiazuriZnQz0NN00wovye/eKwkPBNeb8deEGxENeKYt2XxmzQOA3BQxNdz068lhyD/NoSjlMSgn4eaoxzsaFfvvHtUbNeJvwgdXbyLdq9IeCa8S/tNTt6OvSDdDdbSKf6GwSp97TPBGSfnwppMFTZpHAY16nf0EdZkqhJVD1jmpl9L5SU0uQ5B/m0NwpWf+THFjPqyrn6xSeMwssqIwkY52NFFurMjrt55961dEgVZrkIWWi0p5H4ROrp9klFIiWEBW4riaqlhhqB9YgXLj5b2m5yVdfBuvB17Qb+eELNLbUCgSO4rUqOK4YagCYp0VPraZ1d5sZVzRaLLcMbJOYQ1mSqHtvLYbNI4DG9RU/6bogPtmCFoH9PaJVHQWU6jJKoesCcpdULMTb+Wz87UZDs9hHc4vu+FHIL82x8Blynr8sc66HGsyAMVZhwAlg3u9GVd/ffmNg9ik8ZhYRCtk5Xj/YCWYJZyfQRcpn6HN1SKdGdHifcMta3LH+uuSHQZWrskClk4T/iyXIUssd/u3kUsvs1Gr9U/DVSYcQ7X84P6JKOQ+afIYhLDArYRQGlE5bM5V+YwUqXCDEH7wY8qCTV8eho2/xHo3ZvbPN4YsM4q6+DdKWiLL3g79oJ7uJ1wj0vNY4zIppFnrGxFZC8Ht5DcV6STXzxWt2MvCLTgRPpAExTpQ5B/G6j0tc+rd949X4SOLlwH5dwX/KiSFH/DYOCMk3PjD/iBCGsyVQvoWaf/Gwm0/JhiRtikcRjbJxrqL9RK+SxXIQvHM+vfxLCALTBD0D4zwLvMprVLoqU2IFBRxXBDUkYbsbki0WW6obqXTlLqhE3RgXZp7ZIoam752p6dqcmdHsI7dnoI73X5Yx2BCjMOgolY/MlyFbLK8X5APgIuUz2BRaHW5Y911WbkhyGVtJQiFt9mBirMOAWpp8rxWvfZ8tmcKxm9Vv8aPj0N7s1tHu1OBuzEJo3Dx6XmMTNWtiIw1d3Q27EXBNgyfPYswSzlL0JHFwt+VEkI/T+7/A5vqP+NBFoU6c6OF2qlfOOZ9W/gGp6dq+HT06hiuCFckegyXxKDwLR2SRS39SLmQwZy9UCFGQdkuQpZZzphq5PJMbiQSlpKey6Qnnit+2yMXqt/j93AjRqoMOMZK1sR7dgLAu5bYPAFP6okBrzB1vJPkcXxzPo31fDpadZzgpsigNKIIQO5espnc67J5BhcPRdITz6UI711b27zduwFAYIfVRKBnD7gavj0NGl7n8adiM/VngukJ7o3t3m5tNyLTUeMmE7E52qloC2+piNGTFLQFl9RU32t");
  base64DecodeToExistingUint8Array(bufferView, 8192, "ECAB");
}
function wasm2js_trap() { throw new Error('abort'); }

function asmFunc(imports) {
 var buffer = new ArrayBuffer(131072);
 var HEAP8 = new Int8Array(buffer);
 var HEAP16 = new Int16Array(buffer);
 var HEAP32 = new Int32Array(buffer);
 var HEAPU8 = new Uint8Array(buffer);
 var HEAPU16 = new Uint16Array(buffer);
 var HEAPU32 = new Uint32Array(buffer);
 var HEAPF32 = new Float32Array(buffer);
 var HEAPF64 = new Float64Array(buffer);
 var Math_imul = Math.imul;
 var Math_fround = Math.fround;
 var Math_abs = Math.abs;
 var Math_clz32 = Math.clz32;
 var Math_min = Math.min;
 var Math_max = Math.max;
 var Math_floor = Math.floor;
 var Math_ceil = Math.ceil;
 var Math_trunc = Math.trunc;
 var Math_sqrt = Math.sqrt;
 var __stack_pointer = 73744;
 var i64toi32_i32$HIGH_BITS = 0;
 function alloc($0) {
  $0 = $0 | 0;
  return malloc($0) | 0;
 }
 
 function init() {
  var $0 = 0, $1 = 0, $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0;
  $0 = __stack_pointer - 1040 | 0;
  __stack_pointer = $0;
  $1 = memset($0, 1040);
  $0 = 0;
  $3 = __stack_pointer - 16 | 0;
  __stack_pointer = $3;
  memset($1, 1040);
  $4 = HEAP32[1644] + HEAP32[1642] | 0;
  $2 = cbAlloc(0, $4 + 48256 | 0);
  block1 : {
   if (!$2) {
    HEAP32[$1 >> 2] = 1;
    HEAP8[$1 + 16 | 0] = 0;
    break block1;
   }
   $0 = $2 + (0 - $2 & 255) | 0;
   memset($0, 384);
   $5 = $0 + 272 | 0;
   HEAP32[$5 >> 2] = $4;
   HEAP32[$5 + 4 >> 2] = 0;
   HEAP32[$0 + 264 >> 2] = $0 + 47744;
   HEAP32[$0 + 24 >> 2] = 22;
   HEAP32[$0 + 28 >> 2] = 0;
   HEAP32[$0 + 32 >> 2] = 0;
   HEAP32[$0 + 36 >> 2] = 0;
   HEAP32[$0 + 16 >> 2] = $2;
   HEAP32[$0 + 8 >> 2] = 0;
   HEAP32[$0 + 12 >> 2] = 0;
   HEAP32[$0 >> 2] = 1681487984;
   HEAP32[$0 + 4 >> 2] = 0;
  }
  __stack_pointer = $3 + 16 | 0;
  HEAP32[2049] = $0;
  $3 = !$0;
  block : {
   if ($3) {
    break block
   }
   if (HEAP32[$1 >> 2]) {
    break block
   }
   $2 = __stack_pointer - 16 | 0;
   __stack_pointer = $2;
   memset($1, 1040);
   block10 : {
    if ($3) {
     HEAP32[$1 >> 2] = 2;
     HEAP8[$1 + 16 | 0] = 0;
     break block10;
    }
    $3 = HEAP32[$0 + 4 >> 2];
    $4 = HEAP32[$0 >> 2];
    if (!(!$3 & ($4 | 0) == 1681487984)) {
     HEAP32[$1 >> 2] = 2;
     HEAP32[$2 + 8 >> 2] = 1681487984;
     HEAP32[$2 + 12 >> 2] = 0;
     HEAP32[$2 >> 2] = $4;
     HEAP32[$2 + 4 >> 2] = $3;
     HEAP8[$1 + 16 | 0] = 0;
     break block10;
    }
    memset($0 + 40 | 0, 224);
    memset($0 + 280 | 0, 24);
    HEAP32[$0 + 8 >> 2] = 0;
    HEAP32[$0 + 12 >> 2] = 0;
   }
   __stack_pointer = $2 + 16 | 0;
   $6 = !HEAP32[$1 >> 2];
  }
  __stack_pointer = $1 + 1040 | 0;
  return $6 | 0;
 }
 
 function cbAlloc($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  return malloc($1) | 0;
 }
 
 function decompress($0, $1, $2, $3) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  $2 = $2 | 0;
  $3 = $3 | 0;
  var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $24 = __stack_pointer - 1056 | 0;
  __stack_pointer = $24;
  $12 = $24 + 16 | 0;
  memset($12, 1040);
  $11 = HEAP32[2049];
  $5 = __stack_pointer - 32 | 0;
  __stack_pointer = $5;
  memset($12, 1040);
  block1 : {
   if (!$11) {
    HEAP32[$12 >> 2] = 2;
    HEAP8[$12 + 16 | 0] = 0;
    break block1;
   }
   $4 = HEAP32[$11 + 4 >> 2];
   $8 = HEAP32[$11 >> 2];
   if (!(!$4 & ($8 | 0) == 1681487984)) {
    HEAP32[$12 >> 2] = 2;
    HEAP32[$5 + 24 >> 2] = 1681487984;
    HEAP32[$5 + 28 >> 2] = 0;
    HEAP32[$5 + 16 >> 2] = $8;
    HEAP32[$5 + 20 >> 2] = $4;
    HEAP8[$12 + 16 | 0] = 0;
    break block1;
   }
   $4 = $11 + 288 | 0;
   $8 = HEAP32[$4 >> 2];
   $7 = $11 + 296 | 0;
   $6 = HEAP32[$7 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   $7 = HEAP32[$7 + 4 >> 2];
   if (!(($8 | 0) == ($6 | 0) & ($4 | 0) == ($7 | 0))) {
    HEAP32[$12 >> 2] = 14;
    HEAP32[$5 + 8 >> 2] = $6;
    HEAP32[$5 + 12 >> 2] = $7;
    HEAP32[$5 >> 2] = $8;
    HEAP32[$5 + 4 >> 2] = $4;
    HEAP8[$12 + 16 | 0] = 0;
    break block1;
   }
   HEAP32[$11 + 296 >> 2] = 0;
   HEAP32[$11 + 300 >> 2] = 0;
   HEAP32[$11 + 280 >> 2] = $0;
   HEAP32[$11 + 288 >> 2] = $1;
   HEAP32[$11 + 292 >> 2] = 0;
  }
  __stack_pointer = $5 + 32 | 0;
  if (!HEAP32[$24 + 16 >> 2]) {
   while (1) {
    block2 : {
     $5 = HEAP32[2049];
     $27 = $2 + $29 | 0;
     $26 = $3 - $29 | 0;
     $32 = $24 + 12 | 0;
     $33 = $24 + 8 | 0;
     $21 = 0;
     $10 = __stack_pointer - 1616 | 0;
     __stack_pointer = $10;
     $12 = $24 + 16 | 0;
     memset($12, 1040);
     block61 : {
      block26 : {
       block10 : {
        block11 : {
         if (!$5) {
          HEAP32[$12 >> 2] = 2;
          HEAP8[$12 + 16 | 0] = 0;
          break block11;
         }
         $11 = HEAP32[$5 + 4 >> 2];
         $4 = HEAP32[$5 >> 2];
         if (!(!$11 & ($4 | 0) == 1681487984)) {
          HEAP32[$12 >> 2] = 2;
          HEAP32[$10 + 648 >> 2] = 1681487984;
          HEAP32[$10 + 652 >> 2] = 0;
          HEAP32[$10 + 640 >> 2] = $4;
          HEAP32[$10 + 644 >> 2] = $11;
          HEAP8[$12 + 16 | 0] = 0;
          break block11;
         }
         $11 = $5 + 33152 | 0;
         block36 : {
          $4 = HEAP32[$5 + 12 >> 2];
          $8 = HEAP32[$5 + 8 >> 2];
          if (!(!$4 & $8 >>> 0 > 3 | ($4 | 0) != 0)) {
           block7 : {
            block5 : {
             switch ($8 - 1 | 0) {
             case 2:
              $4 = $5 + 88 | 0;
              $7 = HEAP32[$4 >> 2];
              $6 = HEAP32[$4 + 4 >> 2];
              $4 = $5 + 136 | 0;
              $9 = HEAP32[$4 >> 2];
              $13 = HEAP32[$4 + 4 >> 2];
              break block7;
             default:
              HEAP32[$5 + 8 >> 2] = 1;
              HEAP32[$5 + 12 >> 2] = 0;
              break;
             case 0:
             case 1:
              break block5;
             };
            }
            $4 = $5 + 112 | 0;
            $8 = HEAP32[$4 >> 2];
            $4 = HEAP32[$4 + 4 >> 2];
            $7 = $4;
            if (!(!$4 & $8 >>> 0 < 32)) {
             HEAP32[$12 >> 2] = 3;
             $11 = $10 + 624 | 0;
             HEAP32[$11 >> 2] = $8;
             HEAP32[$11 + 4 >> 2] = $4;
             $11 = $10 + 616 | 0;
             HEAP32[$11 >> 2] = 32;
             HEAP32[$11 + 4 >> 2] = 0;
             HEAP32[$10 + 604 >> 2] = 584;
             HEAP32[$10 + 608 >> 2] = 0;
             HEAP32[$10 + 600 >> 2] = 4368;
             HEAP32[$10 + 596 >> 2] = 4393;
             HEAP32[$10 + 592 >> 2] = 4041;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $9 = $8 + $11 | 0;
            $14 = $5 + 296 | 0;
            $6 = HEAP32[$14 >> 2];
            $13 = $6 + HEAP32[$5 + 280 >> 2] | 0;
            $15 = $5 + 288 | 0;
            $17 = HEAP32[$15 >> 2];
            $4 = $17 - $6 | 0;
            $7 = 0 - (($8 >>> 0 > 32) + $7 | 0) | 0;
            $6 = HEAP32[$15 + 4 >> 2] - (HEAP32[$14 + 4 >> 2] + ($6 >>> 0 > $17 >>> 0) | 0) | 0;
            $8 = 32 - $8 | 0;
            if (!(($7 | 0) == ($6 | 0) & $8 >>> 0 <= $4 >>> 0 | $6 >>> 0 > $7 >>> 0)) {
             memcpy($9, $13, $4);
             $11 = $6 + HEAP32[$5 + 300 >> 2] | 0;
             $7 = $11 + 1 | 0;
             $9 = $11;
             $11 = HEAP32[$5 + 296 >> 2] + $4 | 0;
             $12 = $11 >>> 0 < $4 >>> 0 ? $7 : $9;
             HEAP32[$5 + 296 >> 2] = $11;
             HEAP32[$5 + 300 >> 2] = $12;
             $11 = $6 + HEAP32[$5 + 116 >> 2] | 0;
             $9 = $11 + 1 | 0;
             $6 = $11;
             $11 = $4 + HEAP32[$5 + 112 >> 2] | 0;
             $12 = $11 >>> 0 < $4 >>> 0 ? $9 : $6;
             HEAP32[$5 + 112 >> 2] = $11;
             HEAP32[$5 + 116 >> 2] = $12;
             $4 = 32 - $11 | 0;
             break block10;
            }
            memcpy($9, $13, $8);
            $4 = $7 + HEAP32[$5 + 300 >> 2] | 0;
            $9 = $4 + 1 | 0;
            $6 = $4;
            $4 = $8 + HEAP32[$5 + 296 >> 2] | 0;
            $6 = $4 >>> 0 < $8 >>> 0 ? $9 : $6;
            HEAP32[$5 + 296 >> 2] = $4;
            HEAP32[$5 + 300 >> 2] = $6;
            $4 = $7 + HEAP32[$5 + 116 >> 2] | 0;
            $9 = $4 + 1 | 0;
            $6 = $4;
            $4 = $8 + HEAP32[$5 + 112 >> 2] | 0;
            $8 = $8 >>> 0 > $4 >>> 0 ? $9 : $6;
            HEAP32[$5 + 112 >> 2] = $4;
            HEAP32[$5 + 116 >> 2] = $8;
            if (HEAP32[$5 + 33152 >> 2] != 1317459754) {
             HEAP32[$12 >> 2] = 10;
             $11 = HEAP32[$11 >> 2];
             HEAP32[$10 + 580 >> 2] = 1317459754;
             HEAP32[$10 + 576 >> 2] = $11;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            if (!HEAP32[$5 + 12 >> 2] & HEAP32[$5 + 8 >> 2] == 1) {
             HEAP32[$5 + 380 >> 2] = 0;
             HEAP32[$5 + 376 >> 2] = HEAP32[$5 + 33172 >> 2];
             $4 = 0;
            } else {
             $4 = HEAP32[$5 + 380 >> 2]
            }
            if (($4 | 0) != HEAP32[$5 + 33176 >> 2]) {
             HEAP32[$12 >> 2] = 10;
             $11 = HEAP32[$5 + 33176 >> 2];
             HEAP32[$10 + 564 >> 2] = $4;
             HEAP32[$10 + 560 >> 2] = $11;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $4 = HEAP32[$5 + 376 >> 2];
            if (($4 | 0) != HEAP32[$5 + 33172 >> 2]) {
             HEAP32[$12 >> 2] = 10;
             $11 = HEAP32[$5 + 33172 >> 2];
             HEAP32[$10 + 548 >> 2] = $4;
             HEAP32[$10 + 544 >> 2] = $11;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            if (HEAP32[$5 + 33168 >> 2]) {
             HEAP32[$12 >> 2] = 10;
             HEAP32[$10 + 528 >> 2] = HEAP32[$5 + 33168 >> 2];
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $6 = 0;
            $8 = 0;
            $4 = -1;
            $7 = 28;
            while (1) {
             $9 = $8 + $11 | 0;
             $4 = HEAP32[(((HEAPU8[$9 | 0] ^ $4) & 255) << 2) + 7168 >> 2] ^ $4 >>> 8;
             $4 = HEAP32[((($4 ^ HEAPU8[$9 + 1 | 0]) & 255) << 2) + 7168 >> 2] ^ $4 >>> 8;
             $8 = $8 + 2 | 0;
             $6 = $6 - 1 | 0;
             $7 = $7 - 2 | 0;
             $6 = $7 >>> 0 < 4294967294 ? $6 + 1 | 0 : $6;
             if ($6 | $7) {
              continue
             }
             break;
            };
            $4 = $4 ^ -1;
            if (($4 | 0) != HEAP32[$5 + 33180 >> 2]) {
             HEAP32[$12 >> 2] = 10;
             HEAP32[$10 + 516 >> 2] = HEAP32[$5 + 33180 >> 2];
             HEAP32[$10 + 512 >> 2] = $4;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $4 = $5 + 136 | 0;
            $8 = HEAP32[$5 + 33164 >> 2];
            HEAP32[$4 >> 2] = $8 & 8191;
            HEAP32[$4 + 4 >> 2] = 0;
            block23 : {
             block19 : {
              if (!(HEAP32[$5 + 8 >> 2] != 1 | HEAP32[$5 + 12 >> 2] != 0)) {
               $7 = $5 + 144 | 0;
               $4 = $8 >>> 15 & 6;
               HEAP32[$7 >> 2] = $4;
               HEAP32[$7 + 4 >> 2] = 0;
               if ($4 >>> 0 < 5) {
                break block19
               }
               HEAP32[$12 >> 2] = 10;
               HEAP32[$10 + 288 >> 2] = $4;
               HEAP32[$10 + 292 >> 2] = 0;
               HEAP8[$12 + 16 | 0] = 0;
               break block11;
              }
              $7 = $5 + 128 | 0;
              $4 = HEAP32[$7 >> 2];
              $7 = HEAP32[$7 + 4 >> 2];
              $6 = $8 >>> 13 & 7 | 16;
              if (!(!$7 & ($6 | 0) == ($4 | 0))) {
               HEAP32[$12 >> 2] = 10;
               HEAP32[$10 + 504 >> 2] = $4;
               HEAP32[$10 + 508 >> 2] = $7;
               HEAP32[$10 + 496 >> 2] = $6;
               HEAP32[$10 + 500 >> 2] = 0;
               HEAP8[$12 + 16 | 0] = 0;
               break block11;
              }
              $7 = $5 + 144 | 0;
              $4 = HEAP32[$7 >> 2];
              $7 = HEAP32[$7 + 4 >> 2];
              $6 = $8 >>> 15 & 6;
              if (!(!$7 & ($6 | 0) == ($4 | 0))) {
               HEAP32[$12 >> 2] = 10;
               HEAP32[$10 + 488 >> 2] = $4;
               HEAP32[$10 + 492 >> 2] = $7;
               HEAP32[$10 + 480 >> 2] = $6;
               HEAP32[$10 + 484 >> 2] = 0;
               HEAP8[$12 + 16 | 0] = 0;
               break block11;
              }
              $4 = ($8 >>> 18 & 1) + 3 | 0;
              $7 = $4 >>> 0 < 3;
              $6 = $5 + 152 | 0;
              $9 = HEAP32[$6 >> 2];
              $6 = HEAP32[$6 + 4 >> 2];
              if (!(($4 | 0) == ($9 | 0) & ($7 | 0) == ($6 | 0))) {
               HEAP32[$12 >> 2] = 10;
               HEAP32[$10 + 472 >> 2] = $9;
               HEAP32[$10 + 476 >> 2] = $6;
               HEAP32[$10 + 464 >> 2] = $4;
               HEAP32[$10 + 468 >> 2] = $7;
               HEAP8[$12 + 16 | 0] = 0;
               break block11;
              }
              $7 = $5 + 160 | 0;
              $4 = HEAP32[$7 >> 2];
              $7 = HEAP32[$7 + 4 >> 2];
              $6 = $8 >>> 19 & 1 | 2;
              if (!$7 & ($6 | 0) == ($4 | 0)) {
               break block23
              }
              HEAP32[$12 >> 2] = 10;
              HEAP32[$10 + 456 >> 2] = $4;
              HEAP32[$10 + 460 >> 2] = $7;
              HEAP32[$10 + 448 >> 2] = $6;
              HEAP32[$10 + 452 >> 2] = 0;
              HEAP8[$12 + 16 | 0] = 0;
              break block11;
             }
             $4 = $5 + 160 | 0;
             HEAP32[$4 >> 2] = $8 >>> 19 & 1 | 2;
             HEAP32[$4 + 4 >> 2] = 0;
             $4 = ($8 >>> 18 & 1) + 3 | 0;
             $7 = $4 >>> 0 < 3;
             $6 = $5 + 152 | 0;
             HEAP32[$6 >> 2] = $4;
             HEAP32[$6 + 4 >> 2] = $7;
             $4 = $5 + 128 | 0;
             HEAP32[$4 >> 2] = $8 >>> 13 & 7 | 16;
             HEAP32[$4 + 4 >> 2] = 0;
             $4 = __stack_pointer - 256 | 0;
             __stack_pointer = $4;
             HEAP32[$5 + 168 >> 2] = 0;
             $6 = $5 + 144 | 0;
             $7 = HEAP32[$6 >> 2];
             block71 : {
              block3 : {
               block : {
                $6 = HEAP32[$6 + 4 >> 2];
                if (!$6 & $7 >>> 0 > 4 | $6) {
                 break block
                }
                block22 : {
                 switch ($7 - 1 | 0) {
                 default:
                  $6 = $5 + 152 | 0;
                  $7 = HEAP32[$6 >> 2];
                  $6 = HEAP32[$6 + 4 >> 2];
                  $9 = $6;
                  block64 : {
                   $6 = $6 - 1 | 0;
                   $13 = $6 + 1 | 0;
                   $14 = $6;
                   $6 = $7 - 3 | 0;
                   $13 = $6 >>> 0 < 4294967293 ? $13 : $14;
                   if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                    if (($6 | 0) == 1) {
                     break block64
                    }
                    HEAP32[$5 + 168 >> 2] = 2;
                    break block71;
                   }
                   HEAP32[$12 >> 2] = 3;
                   $6 = $4 + 56 | 0;
                   HEAP32[$6 >> 2] = $7;
                   HEAP32[$6 + 4 >> 2] = $9;
                   HEAP32[$4 + 44 >> 2] = 112;
                   HEAP32[$4 + 48 >> 2] = 0;
                   HEAP32[$4 + 40 >> 2] = 4368;
                   HEAP32[$4 + 36 >> 2] = 4318;
                   HEAP32[$4 + 32 >> 2] = 4914;
                   HEAP8[$12 + 16 | 0] = 0;
                   break block71;
                  }
                  HEAP32[$5 + 168 >> 2] = 3;
                  break block71;
                 case 0:
                 case 2:
                  break block;
                 case 1:
                  break block22;
                 case 3:
                  break block3;
                 };
                }
                $6 = $5 + 152 | 0;
                $7 = HEAP32[$6 >> 2];
                $6 = HEAP32[$6 + 4 >> 2];
                $9 = $6;
                block105 : {
                 $6 = $6 - 1 | 0;
                 $13 = $6 + 1 | 0;
                 $14 = $6;
                 $6 = $7 - 3 | 0;
                 $13 = $6 >>> 0 < 4294967293 ? $13 : $14;
                 if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                  if (($6 | 0) == 1) {
                   break block105
                  }
                  $6 = $5 + 160 | 0;
                  $7 = HEAP32[$6 >> 2];
                  $6 = HEAP32[$6 + 4 >> 2];
                  $9 = $6;
                  block136 : {
                   $6 = $6 - 1 | 0;
                   $13 = $6 + 1 | 0;
                   $14 = $6;
                   $6 = $7 - 2 | 0;
                   $13 = $6 >>> 0 < 4294967294 ? $13 : $14;
                   if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                    if (($6 | 0) == 1) {
                     break block136
                    }
                    HEAP32[$5 + 168 >> 2] = 4;
                    break block71;
                   }
                   HEAP32[$12 >> 2] = 3;
                   $6 = $4 + 120 | 0;
                   HEAP32[$6 >> 2] = $7;
                   HEAP32[$6 + 4 >> 2] = $9;
                   HEAP32[$4 + 108 >> 2] = 126;
                   HEAP32[$4 + 112 >> 2] = 0;
                   HEAP32[$4 + 104 >> 2] = 4368;
                   HEAP32[$4 + 100 >> 2] = 4318;
                   HEAP32[$4 + 96 >> 2] = 5133;
                   HEAP8[$12 + 16 | 0] = 0;
                   break block71;
                  }
                  HEAP32[$5 + 168 >> 2] = 5;
                  break block71;
                 }
                 HEAP32[$12 >> 2] = 3;
                 $6 = $4 + 88 | 0;
                 HEAP32[$6 >> 2] = $7;
                 HEAP32[$6 + 4 >> 2] = $9;
                 HEAP32[$4 + 76 >> 2] = 132;
                 HEAP32[$4 + 80 >> 2] = 0;
                 HEAP32[$4 + 72 >> 2] = 4368;
                 HEAP32[$4 + 68 >> 2] = 4318;
                 HEAP32[$4 + 64 >> 2] = 4914;
                 HEAP8[$12 + 16 | 0] = 0;
                 break block71;
                }
                $6 = $5 + 160 | 0;
                $7 = HEAP32[$6 >> 2];
                $6 = HEAP32[$6 + 4 >> 2];
                $9 = $6;
                block16 : {
                 $6 = $6 - 1 | 0;
                 $13 = $6 + 1 | 0;
                 $14 = $6;
                 $6 = $7 - 2 | 0;
                 $13 = $6 >>> 0 < 4294967294 ? $13 : $14;
                 if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                  if (($6 | 0) == 1) {
                   break block16
                  }
                  HEAP32[$5 + 168 >> 2] = 6;
                  break block71;
                 }
                 HEAP32[$12 >> 2] = 3;
                 $6 = $4 + 152 | 0;
                 HEAP32[$6 >> 2] = $7;
                 HEAP32[$6 + 4 >> 2] = $9;
                 HEAP32[$4 + 140 >> 2] = 139;
                 HEAP32[$4 + 144 >> 2] = 0;
                 HEAP32[$4 + 136 >> 2] = 4368;
                 HEAP32[$4 + 132 >> 2] = 4318;
                 HEAP32[$4 + 128 >> 2] = 5133;
                 HEAP8[$12 + 16 | 0] = 0;
                 break block71;
                }
                HEAP32[$5 + 168 >> 2] = 7;
                break block71;
               }
               HEAP32[$12 >> 2] = 3;
               $9 = $4 + 24 | 0;
               HEAP32[$9 >> 2] = $7;
               HEAP32[$9 + 4 >> 2] = $6;
               HEAP32[$4 + 12 >> 2] = 146;
               HEAP32[$4 + 16 >> 2] = 0;
               HEAP32[$4 + 8 >> 2] = 4368;
               HEAP32[$4 + 4 >> 2] = 4318;
               HEAP32[$4 >> 2] = 4869;
               HEAP8[$12 + 16 | 0] = 0;
               break block71;
              }
              $6 = $5 + 152 | 0;
              $7 = HEAP32[$6 >> 2];
              $6 = HEAP32[$6 + 4 >> 2];
              $9 = $6;
              block197 : {
               $6 = $6 - 1 | 0;
               $13 = $6 + 1 | 0;
               $14 = $6;
               $6 = $7 - 3 | 0;
               $13 = $6 >>> 0 < 4294967293 ? $13 : $14;
               if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                if (($6 | 0) == 1) {
                 break block197
                }
                $6 = $5 + 160 | 0;
                $7 = HEAP32[$6 >> 2];
                $6 = HEAP32[$6 + 4 >> 2];
                $9 = $6;
                block228 : {
                 $6 = $6 - 1 | 0;
                 $13 = $6 + 1 | 0;
                 $14 = $6;
                 $6 = $7 - 2 | 0;
                 $13 = $6 >>> 0 < 4294967294 ? $13 : $14;
                 if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                  if (($6 | 0) == 1) {
                   break block228
                  }
                  HEAP32[$5 + 168 >> 2] = 8;
                  break block71;
                 }
                 HEAP32[$12 >> 2] = 3;
                 $6 = $4 + 216 | 0;
                 HEAP32[$6 >> 2] = $7;
                 HEAP32[$6 + 4 >> 2] = $9;
                 HEAP32[$4 + 204 >> 2] = 155;
                 HEAP32[$4 + 208 >> 2] = 0;
                 HEAP32[$4 + 200 >> 2] = 4368;
                 HEAP32[$4 + 196 >> 2] = 4318;
                 HEAP32[$4 + 192 >> 2] = 5133;
                 HEAP8[$12 + 16 | 0] = 0;
                 break block71;
                }
                HEAP32[$5 + 168 >> 2] = 9;
                break block71;
               }
               HEAP32[$12 >> 2] = 3;
               $6 = $4 + 184 | 0;
               HEAP32[$6 >> 2] = $7;
               HEAP32[$6 + 4 >> 2] = $9;
               HEAP32[$4 + 172 >> 2] = 161;
               HEAP32[$4 + 176 >> 2] = 0;
               HEAP32[$4 + 168 >> 2] = 4368;
               HEAP32[$4 + 164 >> 2] = 4318;
               HEAP32[$4 + 160 >> 2] = 4914;
               HEAP8[$12 + 16 | 0] = 0;
               break block71;
              }
              $6 = $5 + 160 | 0;
              $7 = HEAP32[$6 >> 2];
              $6 = HEAP32[$6 + 4 >> 2];
              $9 = $6;
              block25 : {
               $6 = $6 - 1 | 0;
               $13 = $6 + 1 | 0;
               $14 = $6;
               $6 = $7 - 2 | 0;
               $13 = $6 >>> 0 < 4294967294 ? $13 : $14;
               if (!(!$13 & $6 >>> 0 > 1 | ($13 | 0) != 0)) {
                if (($6 | 0) == 1) {
                 break block25
                }
                HEAP32[$5 + 168 >> 2] = 10;
                break block71;
               }
               HEAP32[$12 >> 2] = 3;
               $6 = $4 + 248 | 0;
               HEAP32[$6 >> 2] = $7;
               HEAP32[$6 + 4 >> 2] = $9;
               HEAP32[$4 + 236 >> 2] = 168;
               HEAP32[$4 + 240 >> 2] = 0;
               HEAP32[$4 + 232 >> 2] = 4368;
               HEAP32[$4 + 228 >> 2] = 4318;
               HEAP32[$4 + 224 >> 2] = 5133;
               HEAP8[$12 + 16 | 0] = 0;
               break block71;
              }
              HEAP32[$5 + 168 >> 2] = 11;
             }
             __stack_pointer = $4 + 256 | 0;
             if (HEAP32[$12 >> 2]) {
              break block11
             }
            }
            if ($8 >>> 0 >= 1048576) {
             HEAP32[$12 >> 2] = 10;
             HEAP32[$10 + 432 >> 2] = $8;
             HEAP32[$10 + 436 >> 2] = 0;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $4 = $5 + 104 | 0;
            HEAP32[$4 >> 2] = 0;
            HEAP32[$4 + 4 >> 2] = 0;
            $4 = $5 + 96 | 0;
            HEAP32[$4 >> 2] = 0;
            HEAP32[$4 + 4 >> 2] = 0;
            $4 = $5 + 80 | 0;
            HEAP32[$4 >> 2] = 0;
            HEAP32[$4 + 4 >> 2] = 0;
            $6 = 0;
            $4 = $5 + 88 | 0;
            $7 = HEAP32[$5 + 33160 >> 2];
            HEAP32[$4 >> 2] = $7;
            HEAP32[$4 + 4 >> 2] = 0;
            $4 = $5 + 360 | 0;
            $8 = HEAP32[$5 + 33156 >> 2];
            HEAP32[$4 >> 2] = $8;
            HEAP32[$4 + 4 >> 2] = 0;
            $4 = HEAP32[$5 + 140 >> 2];
            $13 = $4;
            $14 = $4 + 1 | 0;
            $9 = HEAP32[$5 + 136 >> 2];
            $4 = $9 + 256 | 0;
            if (!(!($4 >>> 0 < 256 ? $14 : $13) & $4 >>> 0 < $7 >>> 0)) {
             HEAP32[$12 >> 2] = 10;
             HEAP32[$10 + 424 >> 2] = $9;
             HEAP32[$10 + 428 >> 2] = $13;
             HEAP32[$10 + 416 >> 2] = $7;
             HEAP32[$10 + 420 >> 2] = 0;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $14 = HEAP32[$5 + 8 >> 2];
            $15 = HEAP32[$5 + 12 >> 2];
            HEAP32[$5 + 8 >> 2] = 3;
            HEAP32[$5 + 12 >> 2] = 0;
            if ($26) {
             break block7
            }
            $4 = 0;
            if (!$15 & ($14 | 0) == 1) {
             break block26
            }
           }
           $4 = $9 + 7 | 0;
           $8 = $4 >>> 0 < 7 ? $13 + 1 | 0 : $13;
           $4 = (($8 & 7) << 29 | $4 >>> 3) + 96 | 0;
           $14 = $4;
           $7 = $7 + 7 | 0;
           $6 = $7 >>> 0 < 7 ? $6 + 1 | 0 : $6;
           $13 = ($6 & 7) << 29 | $7 >>> 3;
           $8 = $8 >>> 3 | 0;
           $7 = $4 >>> 0 < 96 ? $8 + 1 | 0 : $8;
           $9 = $6 >>> 3 | 0;
           $4 = ($7 | 0) == ($9 | 0) & $4 >>> 0 < $13 >>> 0 | $7 >>> 0 < $9 >>> 0;
           $6 = $4 ? $14 : $13;
           $13 = $5 + 112 | 0;
           $8 = HEAP32[$13 >> 2];
           block27 : {
            $14 = $4 ? $7 : $9;
            $7 = $14;
            $4 = HEAP32[$13 + 4 >> 2];
            if (($7 | 0) == ($4 | 0) & $6 >>> 0 <= $8 >>> 0 | $4 >>> 0 > $7 >>> 0) {
             break block27
            }
            $13 = $5 + 296 | 0;
            $7 = HEAP32[$13 >> 2];
            $15 = $5 + 288 | 0;
            $9 = HEAP32[$15 >> 2];
            $17 = HEAP32[$13 + 4 >> 2];
            $13 = $14 - (($6 >>> 0 < $8 >>> 0) + $4 | 0) | 0;
            $4 = $17 + $13 | 0;
            $16 = $4 + 1 | 0;
            $14 = $4;
            $4 = $6 - $8 | 0;
            $22 = $4 + $7 | 0;
            $16 = $4 >>> 0 > $22 >>> 0 ? $16 : $14;
            $14 = HEAP32[$15 + 4 >> 2];
            if (!(($16 | 0) == ($14 | 0) & $9 >>> 0 >= $22 >>> 0 | $14 >>> 0 > $16 >>> 0)) {
             $4 = $8 + $11 | 0;
             $11 = $9 - $7 | 0;
             memcpy($4, $7 + HEAP32[$5 + 280 >> 2] | 0, $11);
             $12 = $14 - (($7 >>> 0 > $9 >>> 0) + $17 | 0) | 0;
             $4 = $12 + HEAP32[$5 + 300 >> 2] | 0;
             $7 = $4 + 1 | 0;
             $9 = $4;
             $4 = $11 + HEAP32[$5 + 296 >> 2] | 0;
             $8 = $4 >>> 0 < $11 >>> 0 ? $7 : $9;
             HEAP32[$5 + 296 >> 2] = $4;
             HEAP32[$5 + 300 >> 2] = $8;
             $12 = $12 + HEAP32[$5 + 116 >> 2] | 0;
             $9 = $12 + 1 | 0;
             $4 = $12;
             $12 = $11 + HEAP32[$5 + 112 >> 2] | 0;
             $11 = $11 >>> 0 > $12 >>> 0 ? $9 : $4;
             HEAP32[$5 + 112 >> 2] = $12;
             HEAP32[$5 + 116 >> 2] = $11;
             $4 = $6 - $12 | 0;
             break block10;
            }
            memcpy($8 + $11 | 0, $7 + HEAP32[$5 + 280 >> 2] | 0, $4);
            $8 = $13 + HEAP32[$5 + 300 >> 2] | 0;
            $7 = $4 + HEAP32[$5 + 296 >> 2] | 0;
            $8 = $7 >>> 0 < $4 >>> 0 ? $8 + 1 | 0 : $8;
            HEAP32[$5 + 296 >> 2] = $7;
            HEAP32[$5 + 300 >> 2] = $8;
            $6 = $13 + HEAP32[$5 + 116 >> 2] | 0;
            $14 = $6 + 1 | 0;
            $9 = $6;
            $6 = $4 + HEAP32[$5 + 112 >> 2] | 0;
            $4 = $4 >>> 0 > $6 >>> 0 ? $14 : $9;
            HEAP32[$5 + 112 >> 2] = $6;
            HEAP32[$5 + 116 >> 2] = $4;
            $4 = HEAP32[$5 + 292 >> 2];
            $6 = HEAP32[$5 + 288 >> 2];
            if (($4 | 0) == ($8 | 0) & $6 >>> 0 >= $7 >>> 0 | $4 >>> 0 > $8 >>> 0) {
             break block27
            }
            HEAP32[$12 >> 2] = 3;
            $11 = $10 + 336 | 0;
            HEAP32[$11 >> 2] = $6;
            HEAP32[$11 + 4 >> 2] = $4;
            $11 = $10 + 328 | 0;
            HEAP32[$11 >> 2] = $7;
            HEAP32[$11 + 4 >> 2] = $8;
            HEAP32[$10 + 316 >> 2] = 779;
            HEAP32[$10 + 320 >> 2] = 0;
            HEAP32[$10 + 312 >> 2] = 4368;
            HEAP32[$10 + 308 >> 2] = 4393;
            HEAP32[$10 + 304 >> 2] = 3920;
            HEAP8[$12 + 16 | 0] = 0;
            break block11;
           }
           $14 = $5 + 33192 | 0;
           HEAP32[$5 + 200 >> 2] = $14;
           $4 = $5 + 192 | 0;
           HEAP32[$4 >> 2] = 32;
           HEAP32[$4 + 4 >> 2] = 0;
           $23 = $5 + 33184 | 0;
           $8 = $23;
           $4 = HEAP32[$8 >> 2];
           $7 = HEAP32[$8 + 4 >> 2];
           $16 = $5 + 184 | 0;
           $8 = $16;
           HEAP32[$8 >> 2] = $4;
           HEAP32[$8 + 4 >> 2] = $7;
           memset($10 + 912 | 0, 704);
           memset($10 + 656 | 0, 256);
           block30 : {
            if (HEAP32[$12 >> 2]) {
             HEAP32[$12 >> 2] = 3;
             HEAP32[$10 + 396 >> 2] = 360;
             HEAP32[$10 + 400 >> 2] = 0;
             HEAP32[$10 + 392 >> 2] = 4368;
             HEAP32[$10 + 388 >> 2] = 3997;
             HEAP32[$10 + 384 >> 2] = 4563;
             HEAP8[$12 + 16 | 0] = 0;
             break block30;
            }
            $8 = $5 + 144 | 0;
            if (HEAP32[$8 >> 2] | HEAP32[$8 + 4 >> 2]) {
             $8 = $5 + 208 | 0;
             HEAP32[$8 >> 2] = $4 & 1;
             HEAP32[$8 + 4 >> 2] = 0;
             $17 = $5 + 216 | 0;
             $8 = ($7 & 1) << 31 | $4 >>> 1;
             $18 = $7 >>> 1 | 0;
             $7 = 0;
             $6 = 0;
             $4 = 31;
             $19 = 0;
             while (1) {
              $21 = ($18 & 31) << 27 | $8 >>> 5;
              $22 = $18 >>> 5 | 0;
              if (($19 | 0) < 0) {
               $9 = 1
              } else {
               $9 = ($19 | 0) <= 0 & $4 >>> 0 <= 4
              }
              block33 : {
               if (!$9) {
                $9 = $19 - 1 | 0;
                $15 = $9 + 1 | 0;
                $13 = $9;
                $9 = $4 - 5 | 0;
                $13 = $9 >>> 0 < 4294967291 ? $15 : $13;
                break block33;
               }
               $15 = HEAP32[$14 >> 2];
               $9 = $4 + 27 | 0;
               $13 = $9 >>> 0 < 27 ? $19 + 1 | 0 : $19;
               $4 = $9 & 31;
               if (($9 & 63) >>> 0 >= 32) {
                $20 = $15 << $4;
                $4 = 0;
               } else {
                $20 = (1 << $4) - 1 & $15 >>> 32 - $4;
                $4 = $15 << $4;
               }
               $4 = $4 + $21 | 0;
               $15 = $20 + $22 | 0;
               $22 = $4 >>> 0 < $21 >>> 0 ? $15 + 1 | 0 : $15;
               $21 = $4;
               $14 = $14 + 4 | 0;
              }
              $4 = HEAP32[$5 + 132 >> 2];
              $15 = $8 & 31;
              $8 = HEAP32[$5 + 128 >> 2];
              if (!(!$4 & $15 >>> 0 < $8 >>> 0 | ($4 | 0) != 0)) {
               HEAP32[$12 >> 2] = 9;
               HEAP32[$10 + 376 >> 2] = $8;
               HEAP32[$10 + 380 >> 2] = $4;
               HEAP32[$10 + 368 >> 2] = $15;
               HEAP32[$10 + 372 >> 2] = 0;
               HEAP8[$12 + 16 | 0] = 0;
               break block30;
              }
              $8 = ((1 << $15) - 1 & $22) << 32 - $15 | $21 >>> $15;
              $18 = $22 >>> $15 | 0;
              $20 = $15 << 3;
              $25 = $20 + 6656 | 0;
              $21 = $21 & HEAP32[$25 >> 2];
              $4 = $9 - $15 | 0;
              $9 = $13 - ($9 >>> 0 < $15 >>> 0) | 0;
              $19 = $9;
              if (($9 | 0) < 0) {
               $13 = HEAP32[$14 >> 2];
               $4 = $4 + 32 | 0;
               $19 = $4 >>> 0 < 32 ? $9 + 1 | 0 : $9;
               $9 = $4 & 31;
               if (($4 & 63) >>> 0 >= 32) {
                $15 = $13 << $9;
                $9 = 0;
               } else {
                $15 = (1 << $9) - 1 & $13 >>> 32 - $9;
                $9 = $13 << $9;
               }
               $9 = $9 + $8 | 0;
               $13 = $15 + $18 | 0;
               $18 = $8 >>> 0 > $9 >>> 0 ? $13 + 1 | 0 : $13;
               $14 = $14 + 4 | 0;
               $8 = $9;
              }
              $9 = $20 + 6400 | 0;
              $13 = HEAP32[$9 >> 2];
              $9 = HEAP32[$9 + 4 >> 2] + ($22 & HEAP32[$25 + 4 >> 2]) | 0;
              $20 = $9 + 1 | 0;
              $15 = $9;
              $9 = $13 + $21 | 0;
              $13 = $9 >>> 0 < $21 >>> 0 ? $20 : $15;
              HEAP32[$17 >> 2] = $9;
              HEAP32[$17 + 4 >> 2] = $13;
              $17 = $17 + 8 | 0;
              $7 = $7 + 1 | 0;
              $6 = $7 ? $6 : $6 + 1 | 0;
              $9 = HEAP32[$5 + 148 >> 2];
              if (($6 | 0) == ($9 | 0) & HEAPU32[$5 + 144 >> 2] > $7 >>> 0 | $6 >>> 0 < $9 >>> 0) {
               continue
              }
              break;
             };
             HEAP32[$5 + 200 >> 2] = $14;
             HEAP32[$5 + 192 >> 2] = $4;
             HEAP32[$5 + 196 >> 2] = $19;
             HEAP32[$5 + 184 >> 2] = $8;
             HEAP32[$5 + 188 >> 2] = $18;
            }
            $4 = $10 + 912 | 0;
            HuffmanDecodeLengthTable($12, $16, $4, 704);
            if (HEAP32[$12 >> 2]) {
             break block36
            }
            $6 = $4;
            $4 = $5 + 41600 | 0;
            (wasm2js_i32$0 = $5 + 172 | 0, wasm2js_i32$1 = HuffmanCreateDecodeTables($12, $6, 704, $5 + 384 | 0, 8192, 12, 6, $4)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
            if (HEAP32[$12 >> 2]) {
             break block36
            }
            $8 = $10 + 656 | 0;
            HuffmanDecodeLengthTable($12, $16, $8, 256);
            if (HEAP32[$12 >> 2]) {
             break block36
            }
            (wasm2js_i32$0 = $5 + 176 | 0, wasm2js_i32$1 = HuffmanCreateDecodeTables($12, $8, 256, $5 + 16768 | 0, 8192, 12, 6, $4)), HEAP32[wasm2js_i32$0 >> 2] = wasm2js_i32$1;
           }
           $21 = 0;
           if (HEAP32[$12 >> 2]) {
            break block11
           }
           $4 = HEAP32[$5 + 200 >> 2] - $23 << 3;
           $7 = HEAP32[$5 + 192 >> 2];
           $8 = $4 - $7 | 0;
           $4 = ($4 >> 31) - (HEAP32[$5 + 196 >> 2] + ($4 >>> 0 < $7 >>> 0) | 0) | 0;
           $7 = $4 - 1 | 0;
           $9 = $7 + 1 | 0;
           $6 = $7;
           $7 = $8 - 32 | 0;
           $6 = $7 >>> 0 < 4294967264 ? $9 : $6;
           $9 = HEAP32[$5 + 136 >> 2];
           $13 = HEAP32[$5 + 140 >> 2];
           if (!(($9 | 0) == ($7 | 0) & ($13 | 0) == ($6 | 0))) {
            HEAP32[$12 >> 2] = 9;
            HEAP32[$10 + 360 >> 2] = $7;
            HEAP32[$10 + 364 >> 2] = $6;
            HEAP32[$10 + 352 >> 2] = $9;
            HEAP32[$10 + 356 >> 2] = $13;
            HEAP8[$12 + 16 | 0] = 0;
            break block11;
           }
           HEAP32[$5 + 8 >> 2] = 4;
           HEAP32[$5 + 12 >> 2] = 0;
           $9 = $4 + 1 | 0;
           $6 = $4;
           $4 = $8 + 224 | 0;
           $8 = $4 >>> 0 < 224 ? $9 : $6;
           $7 = $5 + 80 | 0;
           HEAP32[$7 >> 2] = $4;
           HEAP32[$7 + 4 >> 2] = $8;
          }
          $4 = $5 + 48 | 0;
          $8 = HEAP32[$4 >> 2];
          $18 = HEAP32[$4 + 4 >> 2];
          $22 = 0;
          $14 = 0;
          while (1) {
           $4 = HEAP32[$5 + 72 >> 2];
           $7 = $8 - $4 | 0;
           $9 = $7;
           $6 = HEAP32[$5 + 76 >> 2];
           $8 = $18 - ($6 + ($4 >>> 0 > $8 >>> 0) | 0) | 0;
           $7 = !$8 & $7 >>> 0 < $26 >>> 0;
           $23 = $7 ? $9 : $26;
           if ($27) {
            memcpy($27, HEAP32[$5 + 264 >> 2] + $4 | 0, $23);
            $4 = HEAP32[$5 + 72 >> 2];
            $6 = HEAP32[$5 + 76 >> 2];
           }
           $8 = $7 ? $8 : 0;
           $7 = $6 + $8 | 0;
           $4 = $4 + $23 | 0;
           $19 = $4 >>> 0 < $23 >>> 0 ? $7 + 1 | 0 : $7;
           HEAP32[$5 + 72 >> 2] = $4;
           HEAP32[$5 + 76 >> 2] = $19;
           $7 = $8 + HEAP32[$5 + 108 >> 2] | 0;
           $25 = $23 + HEAP32[$5 + 104 >> 2] | 0;
           $16 = $25 >>> 0 < $23 >>> 0 ? $7 + 1 | 0 : $7;
           HEAP32[$5 + 104 >> 2] = $25;
           HEAP32[$5 + 108 >> 2] = $16;
           $8 = $8 + $22 | 0;
           $6 = $21;
           $21 = $21 + $23 | 0;
           $22 = $6 >>> 0 > $21 >>> 0 ? $8 + 1 | 0 : $8;
           $26 = $26 - $23 | 0;
           $30 = HEAP32[$5 + 248 >> 2];
           $31 = HEAP32[$5 + 252 >> 2];
           $8 = HEAP32[$5 + 96 >> 2];
           $18 = HEAP32[$5 + 100 >> 2];
           block42 : {
            $6 = HEAP32[$5 + 364 >> 2];
            $7 = HEAP32[$5 + 360 >> 2];
            $34 = ($16 | 0) == ($6 | 0) & $25 >>> 0 < $7 >>> 0 | $6 >>> 0 > $16 >>> 0;
            block41 : {
             if (!$34) {
              $9 = $18 + $31 | 0;
              $20 = $8 + $30 | 0;
              $28 = $20 >>> 0 < $8 >>> 0 ? $9 + 1 | 0 : $9;
              $15 = HEAP32[$5 + 88 >> 2];
              $17 = HEAP32[$5 + 92 >> 2];
              $9 = HEAP32[$5 + 80 >> 2];
              $13 = HEAP32[$5 + 84 >> 2];
              break block41;
             }
             $15 = HEAP32[$5 + 88 >> 2];
             $17 = HEAP32[$5 + 92 >> 2];
             $9 = HEAP32[$5 + 80 >> 2];
             $13 = HEAP32[$5 + 84 >> 2];
             $20 = $18 + $31 | 0;
             $35 = $20 + 1 | 0;
             $28 = $20;
             $20 = $8 + $30 | 0;
             $28 = $20 >>> 0 < $8 >>> 0 ? $35 : $28;
             if (($6 | 0) == ($28 | 0) & $7 >>> 0 <= $20 >>> 0 | $6 >>> 0 < $28 >>> 0) {
              break block41
             }
             if (($13 | 0) == ($17 | 0) & $9 >>> 0 < $15 >>> 0 | $13 >>> 0 < $17 >>> 0) {
              break block42
             }
            }
            if (!(!(($7 | 0) != ($20 | 0) | ($6 | 0) != ($28 | 0)) & (($9 | 0) == ($15 | 0) & ($13 | 0) == ($17 | 0)))) {
             HEAP32[$12 >> 2] = 9;
             $11 = $10 + 272 | 0;
             HEAP32[$11 >> 2] = $7;
             HEAP32[$11 + 4 >> 2] = $6;
             $11 = $10 + 264 | 0;
             HEAP32[$11 >> 2] = $25;
             HEAP32[$11 + 4 >> 2] = $16;
             $11 = $10 + 256 | 0;
             HEAP32[$11 >> 2] = $15;
             HEAP32[$11 + 4 >> 2] = $17;
             $11 = $10 + 248 | 0;
             HEAP32[$11 >> 2] = $9;
             HEAP32[$11 + 4 >> 2] = $13;
             $11 = $10 + 240 | 0;
             HEAP32[$11 >> 2] = $30;
             HEAP32[$11 + 4 >> 2] = $31;
             HEAP32[$10 + 232 >> 2] = $7;
             HEAP32[$10 + 236 >> 2] = $6;
             HEAP32[$10 + 224 >> 2] = $8;
             HEAP32[$10 + 228 >> 2] = $18;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            if (!(($7 | 0) != ($25 | 0) | ($6 | 0) != ($16 | 0))) {
             HEAP32[$5 + 8 >> 2] = 2;
             HEAP32[$5 + 12 >> 2] = 0;
             $4 = 0;
             HEAP32[$5 + 112 >> 2] = 0;
             HEAP32[$5 + 116 >> 2] = 0;
             $11 = $5 + 380 | 0;
             HEAP32[$11 >> 2] = HEAP32[$11 >> 2] + 1;
             break block10;
            }
            $9 = $15;
            $13 = $17;
            if ($34) {
             break block42
            }
            HEAP32[$12 >> 2] = 3;
            $11 = $10 + 208 | 0;
            HEAP32[$11 >> 2] = $25;
            HEAP32[$11 + 4 >> 2] = $16;
            $11 = $10 + 200 | 0;
            HEAP32[$11 >> 2] = $7;
            HEAP32[$11 + 4 >> 2] = $6;
            HEAP32[$10 + 196 >> 2] = $26;
            HEAP32[$10 + 188 >> 2] = 911;
            HEAP32[$10 + 192 >> 2] = 0;
            HEAP32[$10 + 184 >> 2] = 4368;
            HEAP32[$10 + 180 >> 2] = 4393;
            HEAP32[$10 + 176 >> 2] = 3801;
            HEAP8[$12 + 16 | 0] = 0;
            break block11;
           }
           if (!$26) {
            $8 = $7 - $25 | 0;
            $4 = 0;
            break block26;
           }
           $16 = HEAP32[$5 + 48 >> 2];
           $20 = HEAP32[$5 + 52 >> 2];
           if (!(($4 | 0) == ($16 | 0) & ($19 | 0) == ($20 | 0))) {
            HEAP32[$12 >> 2] = 3;
            $11 = $10 + 160 | 0;
            HEAP32[$11 >> 2] = $4;
            HEAP32[$11 + 4 >> 2] = $19;
            $11 = $10 + 152 | 0;
            HEAP32[$11 >> 2] = $16;
            HEAP32[$11 + 4 >> 2] = $20;
            HEAP32[$10 + 140 >> 2] = 926;
            HEAP32[$10 + 144 >> 2] = 0;
            HEAP32[$10 + 136 >> 2] = 4368;
            HEAP32[$10 + 132 >> 2] = 4393;
            HEAP32[$10 + 128 >> 2] = 3634;
            HEAP8[$12 + 16 | 0] = 0;
            break block11;
           }
           $16 = HEAP32[$5 + 192 >> 2];
           $9 = $16 + $9 | 0;
           $13 = HEAP32[$5 + 196 >> 2] + $13 | 0;
           $13 = $9 >>> 0 < $16 >>> 0 ? $13 + 1 | 0 : $13;
           $9 = $9 + 32 | 0;
           $13 = $9 >>> 0 < 32 ? $13 + 1 | 0 : $13;
           if ($9 & 7) {
            HEAP32[$12 >> 2] = 3;
            $11 = $10 + 120 | 0;
            HEAP32[$11 >> 2] = $9;
            HEAP32[$11 + 4 >> 2] = $13;
            HEAP32[$10 + 108 >> 2] = 933;
            HEAP32[$10 + 112 >> 2] = 0;
            HEAP32[$10 + 104 >> 2] = 4368;
            HEAP32[$10 + 100 >> 2] = 4393;
            HEAP32[$10 + 96 >> 2] = 5664;
            HEAP8[$12 + 16 | 0] = 0;
            break block11;
           }
           block53 : {
            block51 : {
             block50 : {
              if ($14) {
               $14 = HEAP32[$5 + 200 >> 2];
               break block50;
              }
              $14 = HEAP32[$5 + 200 >> 2];
              if (($13 | 0) == ($17 | 0) & $9 >>> 0 <= $15 >>> 0 | $13 >>> 0 < $17 >>> 0) {
               break block51
              }
             }
             $9 = HEAP32[$5 + 112 >> 2] + $11 | 0;
             if ($14 >>> 0 <= $9 + 7 >>> 0) {
              $9 = 1;
              $13 = 0;
              $14 = 1;
              break block53;
             }
             HEAP32[$12 >> 2] = 3;
             HEAP32[$10 + 28 >> 2] = $9;
             HEAP32[$10 + 24 >> 2] = $11;
             HEAP32[$10 + 20 >> 2] = $14;
             HEAP32[$10 + 12 >> 2] = 950;
             HEAP32[$10 + 16 >> 2] = 0;
             HEAP32[$10 + 8 >> 2] = 4368;
             HEAP32[$10 + 4 >> 2] = 4393;
             HEAP32[$10 >> 2] = 5380;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $8 = HEAP32[$5 + 112 >> 2];
            $18 = HEAP32[$5 + 116 >> 2];
            $4 = $14 - $11 | 0;
            if ($4 >>> 0 > 7168) {
             $7 = $18 - (($4 >> 31) + ($4 >>> 0 > $8 >>> 0) | 0) | 0;
             $18 = $7;
             $8 = $8 - $4 | 0;
             memcpy($11, $4 + $11 | 0, $8);
             HEAP32[$5 + 200 >> 2] = $11;
             HEAP32[$5 + 112 >> 2] = $8;
             HEAP32[$5 + 116 >> 2] = $7;
             $14 = $11;
            }
            $15 = $8 + $11 | 0;
            if ($14 >>> 0 > $15 >>> 0) {
             HEAP32[$12 >> 2] = 3;
             HEAP32[$10 + 92 >> 2] = $15;
             HEAP32[$10 + 88 >> 2] = $11;
             HEAP32[$10 + 84 >> 2] = $14;
             HEAP32[$10 + 76 >> 2] = 985;
             HEAP32[$10 + 80 >> 2] = 0;
             HEAP32[$10 + 72 >> 2] = 4368;
             HEAP32[$10 + 68 >> 2] = 4393;
             HEAP32[$10 + 64 >> 2] = 5905;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $4 = HEAP32[$5 + 88 >> 2];
            $7 = $4 - $9 | 0;
            $4 = HEAP32[$5 + 92 >> 2] - (($4 >>> 0 < $9 >>> 0) + $13 | 0) | 0;
            $9 = $4 + 1 | 0;
            $6 = $4;
            $4 = $7 + 7 | 0;
            $7 = $4 >>> 0 < 7 ? $9 : $6;
            $6 = $7 >>> 3 | 0;
            $9 = ($7 & 7) << 29 | $4 >>> 3;
            $13 = $15 - $14 | 0;
            $4 = $9 - $13 | 0;
            $17 = HEAP32[$5 + 288 >> 2];
            $14 = HEAP32[$5 + 296 >> 2];
            $7 = $17 - $14 | 0;
            block58 : {
             $16 = $13 >> 31;
             $9 = $6 - ($16 + ($9 >>> 0 < $13 >>> 0) | 0) | 0;
             $6 = HEAP32[$5 + 292 >> 2] - (HEAP32[$5 + 300 >> 2] + ($14 >>> 0 > $17 >>> 0) | 0) | 0;
             if (!(($9 | 0) == ($6 | 0) & $4 >>> 0 > $7 >>> 0 | $6 >>> 0 < $9 >>> 0)) {
              $7 = $4;
              $6 = $9;
              break block58;
             }
             if ($6 | $7) {
              break block58
             }
             $8 = HEAP32[$5 + 360 >> 2] - HEAP32[$5 + 104 >> 2] | 0;
             break block26;
            }
            $9 = $7;
            $4 = 8448 - $8 | 0;
            $8 = 0 - (($8 >>> 0 > 8448) + $18 | 0) | 0;
            $7 = ($8 | 0) == ($6 | 0) & $4 >>> 0 > $7 >>> 0 | $6 >>> 0 < $8 >>> 0;
            $4 = $7 ? $9 : $4;
            memcpy($15, $14 + HEAP32[$5 + 280 >> 2] | 0, $4);
            $8 = $7 ? $6 : $8;
            $7 = $8 + HEAP32[$5 + 300 >> 2] | 0;
            $9 = $7 + 1 | 0;
            $6 = $7;
            $7 = $4 + HEAP32[$5 + 296 >> 2] | 0;
            $6 = $7 >>> 0 < $4 >>> 0 ? $9 : $6;
            HEAP32[$5 + 296 >> 2] = $7;
            HEAP32[$5 + 300 >> 2] = $6;
            $7 = $8 + HEAP32[$5 + 116 >> 2] | 0;
            $9 = $7 + 1 | 0;
            $6 = $7;
            $7 = $4 + HEAP32[$5 + 112 >> 2] | 0;
            $6 = $7 >>> 0 < $4 >>> 0 ? $9 : $6;
            HEAP32[$5 + 112 >> 2] = $7;
            HEAP32[$5 + 116 >> 2] = $6;
            $8 = $8 + $16 | 0;
            $4 = $4 + $13 | 0;
            $8 = ($4 >>> 0 < $13 >>> 0 ? $8 + 1 | 0 : $8) << 3 | $4 >>> 29;
            $4 = $4 << 3;
            $6 = _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E($4, $8, 27);
            $4 = !$8 & $4 >>> 0 < 27;
            $9 = $4 ? 1 : $6;
            $13 = $4 ? 0 : i64toi32_i32$HIGH_BITS;
            $4 = HEAP32[$5 + 48 >> 2];
            $19 = HEAP32[$5 + 52 >> 2];
            $8 = HEAP32[$5 + 96 >> 2];
            $18 = HEAP32[$5 + 100 >> 2];
            $7 = HEAP32[$5 + 360 >> 2];
            $6 = HEAP32[$5 + 364 >> 2];
            $14 = 0;
           }
           $27 = $27 ? $23 + $27 | 0 : 0;
           $15 = $7 - $8 | 0;
           $7 = $6 - (($7 >>> 0 < $8 >>> 0) + $18 | 0) | 0;
           $6 = ($7 | 0) == ($13 | 0) & $9 >>> 0 < $15 >>> 0 | $7 >>> 0 > $13 >>> 0;
           $16 = $6 ? $9 : $15;
           $9 = $6 ? $13 : $7;
           $15 = HEAP32[$5 + 272 >> 2];
           $7 = $15 - $4 | 0;
           $17 = HEAP32[$5 + 276 >> 2];
           $6 = $17 - (($4 >>> 0 > $15 >>> 0) + $19 | 0) | 0;
           block59 : {
            if ($6 | !$6 & $7 >>> 0 > 255) {
             break block59
            }
            if (($6 | 0) == ($9 | 0) & $7 >>> 0 >= $16 >>> 0 | $6 >>> 0 > $9 >>> 0) {
             break block59
            }
            if (!$27) {
             HEAP32[$12 >> 2] = 9;
             $11 = $10 + 56 | 0;
             HEAP32[$11 >> 2] = $15;
             HEAP32[$11 + 4 >> 2] = $17;
             $11 = $10 + 48 | 0;
             HEAP32[$11 >> 2] = $4;
             HEAP32[$11 + 4 >> 2] = $19;
             HEAP32[$10 + 40 >> 2] = $16;
             HEAP32[$10 + 44 >> 2] = $9;
             HEAP32[$10 + 32 >> 2] = $7;
             HEAP32[$10 + 36 >> 2] = $6;
             HEAP8[$12 + 16 | 0] = 0;
             break block11;
            }
            $6 = (HEAP32[$5 + 128 >> 2] << 3) + 6400 | 0;
            $7 = HEAP32[$6 >> 2];
            $8 = $4 - $7 | 0;
            $4 = $19 - (HEAP32[$6 + 4 >> 2] + ($4 >>> 0 < $7 >>> 0) | 0) | 0;
            $6 = HEAP32[$5 + 264 >> 2];
            memcpy($6, $6 + $8 | 0, $7);
            $4 = $4 + HEAP32[$5 + 44 >> 2] | 0;
            $7 = $4 + 1 | 0;
            $6 = $4;
            $4 = HEAP32[$5 + 40 >> 2] + $8 | 0;
            $8 = $4 >>> 0 < $8 >>> 0 ? $7 : $6;
            HEAP32[$5 + 40 >> 2] = $4;
            HEAP32[$5 + 44 >> 2] = $8;
            $8 = (HEAP32[$5 + 128 >> 2] << 3) + 6400 | 0;
            $4 = HEAP32[$8 >> 2];
            $19 = HEAP32[$8 + 4 >> 2];
            HEAP32[$5 + 72 >> 2] = $4;
            HEAP32[$5 + 76 >> 2] = $19;
            HEAP32[$5 + 48 >> 2] = $4;
            HEAP32[$5 + 52 >> 2] = $19;
            $15 = HEAP32[$5 + 272 >> 2];
            $7 = $15 - $4 | 0;
            $17 = HEAP32[$5 + 276 >> 2];
            $6 = $17 - (($4 >>> 0 > $15 >>> 0) + $19 | 0) | 0;
            $8 = HEAP32[$5 + 96 >> 2];
            $18 = HEAP32[$5 + 100 >> 2];
           }
           HEAP32[$5 + 64 >> 2] = $15;
           HEAP32[$5 + 68 >> 2] = $17;
           HEAP32[$5 + 96 >> 2] = $8 - $4;
           HEAP32[$5 + 100 >> 2] = $18 - (($4 >>> 0 > $8 >>> 0) + $19 | 0);
           $8 = ($6 | 0) == ($9 | 0) & $7 >>> 0 > $16 >>> 0 | $6 >>> 0 > $9 >>> 0;
           $7 = $8 ? $16 : $7;
           $4 = $4 + $7 | 0;
           HEAP32[$5 + 56 >> 2] = $4;
           $8 = ($8 ? $9 : $6) + $19 | 0;
           HEAP32[$5 + 60 >> 2] = $4 >>> 0 < $7 >>> 0 ? $8 + 1 | 0 : $8;
           $7 = HEAP32[$5 + 80 >> 2];
           $4 = $7 + HEAP32[$5 + 192 >> 2] | 0;
           $8 = HEAP32[$5 + 200 >> 2] - $11 << 3;
           $6 = $4 - $8 | 0;
           $9 = HEAP32[$5 + 196 >> 2] + HEAP32[$5 + 84 >> 2] | 0;
           $4 = ($4 >>> 0 < $7 >>> 0 ? $9 + 1 | 0 : $9) - (($8 >> 31) + ($4 >>> 0 < $8 >>> 0) | 0) | 0;
           $7 = $4 + 1 | 0;
           $9 = $4;
           $4 = $6 + 32 | 0;
           $8 = $4 >>> 0 < 32 ? $7 : $9;
           HEAP32[$5 + 80 >> 2] = $4;
           HEAP32[$5 + 84 >> 2] = $8;
           FUNCTION_TABLE[HEAP32[$5 + 168 >> 2]]($12, $5);
           $18 = HEAP32[$5 + 52 >> 2];
           $4 = $18 + HEAP32[$5 + 100 >> 2] | 0;
           $9 = $4 + 1 | 0;
           $6 = $4;
           $8 = HEAP32[$5 + 48 >> 2];
           $4 = $8 + HEAP32[$5 + 96 >> 2] | 0;
           $7 = $8 >>> 0 > $4 >>> 0 ? $9 : $6;
           HEAP32[$5 + 96 >> 2] = $4;
           HEAP32[$5 + 100 >> 2] = $7;
           $4 = HEAP32[$5 + 200 >> 2] - $11 << 3;
           $6 = HEAP32[$5 + 80 >> 2];
           $9 = HEAP32[$5 + 192 >> 2];
           $7 = $4 + ($6 - $9 | 0) | 0;
           $6 = (HEAP32[$5 + 84 >> 2] - (HEAP32[$5 + 196 >> 2] + ($6 >>> 0 < $9 >>> 0) | 0) | 0) + ($4 >> 31) | 0;
           $4 = ($4 >>> 0 > $7 >>> 0 ? $6 + 1 | 0 : $6) - 1 | 0;
           $9 = $4 + 1 | 0;
           $6 = $4;
           $4 = $7 - 32 | 0;
           $7 = $4 >>> 0 < 4294967264 ? $9 : $6;
           HEAP32[$5 + 80 >> 2] = $4;
           HEAP32[$5 + 84 >> 2] = $7;
           continue;
          };
         }
         $21 = 0;
        }
        HEAP32[$33 >> 2] = 0;
        HEAP32[$32 >> 2] = $21;
        $8 = 0;
        break block61;
       }
       $8 = 0;
      }
      HEAP32[$33 >> 2] = $4;
      HEAP32[$32 >> 2] = $21;
     }
     $11 = $8;
     __stack_pointer = $10 + 1616 | 0;
     if (HEAP32[$24 + 16 >> 2]) {
      $29 = 0;
      break block2;
     }
     $5 = HEAP32[$24 + 12 >> 2];
     if (!$5) {
      break block2
     }
     $29 = $5 + $29 | 0;
     if ($11) {
      continue
     }
    }
    break;
   };
   $11 = HEAP32[2049];
   $2 = __stack_pointer + -64 | 0;
   __stack_pointer = $2;
   $3 = $24 + 16 | 0;
   memset($3, 1040);
   block14 : {
    if (!$11) {
     HEAP32[$3 >> 2] = 2;
     HEAP8[$3 + 16 | 0] = 0;
     break block14;
    }
    $5 = HEAP32[$11 + 4 >> 2];
    $12 = HEAP32[$11 >> 2];
    if (!(!$5 & ($12 | 0) == 1681487984)) {
     HEAP32[$3 >> 2] = 2;
     HEAP32[$2 + 56 >> 2] = 1681487984;
     HEAP32[$2 + 60 >> 2] = 0;
     HEAP32[$2 + 48 >> 2] = $12;
     HEAP32[$2 + 52 >> 2] = $5;
     HEAP8[$3 + 16 | 0] = 0;
     break block14;
    }
    $12 = $11 + 288 | 0;
    $5 = HEAP32[$12 >> 2];
    $12 = HEAP32[$12 + 4 >> 2];
    $4 = HEAP32[$11 + 280 >> 2];
    if (!(!$12 & ($1 | 0) == ($5 | 0) & ($0 | 0) == ($4 | 0))) {
     HEAP32[$3 >> 2] = 2;
     $11 = $2 + 32 | 0;
     HEAP32[$11 >> 2] = $5;
     HEAP32[$11 + 4 >> 2] = $12;
     HEAP32[$2 + 24 >> 2] = $1;
     HEAP32[$2 + 20 >> 2] = $4;
     HEAP32[$2 + 16 >> 2] = $0;
     HEAP8[$3 + 16 | 0] = 0;
     break block14;
    }
    $0 = $11 + 296 | 0;
    $1 = HEAP32[$0 >> 2];
    $0 = HEAP32[$0 + 4 >> 2];
    if (!(($1 | 0) == ($5 | 0) & ($0 | 0) == ($12 | 0))) {
     HEAP32[$3 >> 2] = 14;
     HEAP32[$2 + 8 >> 2] = $1;
     HEAP32[$2 + 12 >> 2] = $0;
     HEAP32[$2 >> 2] = $5;
     HEAP32[$2 + 4 >> 2] = $12;
     HEAP8[$3 + 16 | 0] = 0;
     break block14;
    }
    memset($11 + 280 | 0, 24);
   }
   __stack_pointer = $2 - -64 | 0;
  }
  __stack_pointer = $24 + 1056 | 0;
  return $29 | 0;
 }
 
 function malloc($0) {
  var $1 = 0, $2 = 0, $3 = 0;
  $2 = __wasm_memory_size() << 16;
  $1 = HEAP32[2048];
  $0 = $0 + 15 & -16;
  $3 = $1 + $0 | 0;
  if ($2 >>> 0 < $3 >>> 0) {
   if ((__wasm_memory_grow(($3 - $2 | 0) + 65535 >>> 16 | 0) | 0) == -1) {
    return 0
   }
   $1 = HEAP32[2048];
  }
  HEAP32[2048] = $0 + $1;
  return $1;
 }
 
 function reset_heap() {
  HEAP32[2048] = 73744;
 }
 
 function memcpy($0, $1, $2) {
  var $3 = 0, $4 = 0;
  block : {
   if (!$2) {
    break block
   }
   $3 = $2 & 7;
   block2 : {
    if (!$3) {
     $4 = $2;
     break block2;
    }
    $4 = $2 & -8;
    while (1) {
     HEAP8[$0 | 0] = HEAPU8[$1 | 0];
     $0 = $0 + 1 | 0;
     $1 = $1 + 1 | 0;
     $3 = $3 - 1 | 0;
     if ($3) {
      continue
     }
     break;
    };
   }
   if ($2 >>> 0 < 8) {
    break block
   }
   while (1) {
    HEAP8[$0 | 0] = HEAPU8[$1 | 0];
    HEAP8[$0 + 1 | 0] = HEAPU8[$1 + 1 | 0];
    HEAP8[$0 + 2 | 0] = HEAPU8[$1 + 2 | 0];
    HEAP8[$0 + 3 | 0] = HEAPU8[$1 + 3 | 0];
    HEAP8[$0 + 4 | 0] = HEAPU8[$1 + 4 | 0];
    HEAP8[$0 + 5 | 0] = HEAPU8[$1 + 5 | 0];
    HEAP8[$0 + 6 | 0] = HEAPU8[$1 + 6 | 0];
    HEAP8[$0 + 7 | 0] = HEAPU8[$1 + 7 | 0];
    $0 = $0 + 8 | 0;
    $1 = $1 + 8 | 0;
    $4 = $4 - 8 | 0;
    if ($4) {
     continue
    }
    break;
   };
  }
 }
 
 function memset($0, $1) {
  var $2 = 0, $3 = 0, $4 = 0;
  block : {
   if (!$1) {
    break block
   }
   $2 = $0;
   $3 = $1;
   $4 = $1 & 7;
   if ($4) {
    $3 = $1 & -8;
    while (1) {
     HEAP8[$2 | 0] = 0;
     $2 = $2 + 1 | 0;
     $4 = $4 - 1 | 0;
     if ($4) {
      continue
     }
     break;
    };
   }
   if ($1 >>> 0 < 8) {
    break block
   }
   while (1) {
    HEAP8[$2 + 7 | 0] = 0;
    HEAP8[$2 + 6 | 0] = 0;
    HEAP8[$2 + 5 | 0] = 0;
    HEAP8[$2 + 4 | 0] = 0;
    HEAP8[$2 + 3 | 0] = 0;
    HEAP8[$2 + 2 | 0] = 0;
    HEAP8[$2 + 1 | 0] = 0;
    HEAP8[$2 | 0] = 0;
    $2 = $2 + 8 | 0;
    $3 = $3 - 8 | 0;
    if ($3) {
     continue
    }
    break;
   };
  }
  return $0;
 }
 
 function HuffmanCreateDecodeTables($0, $1, $2, $3, $4, $5, $6, $7) {
  var $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, wasm2js_i32$0 = 0, wasm2js_i32$1 = 0;
  $8 = __stack_pointer - 1680 | 0;
  __stack_pointer = $8;
  memset($8 + 656 | 0, 512);
  block1 : {
   if (HEAP32[$0 >> 2]) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$8 + 636 >> 2] = 347;
    HEAP32[$8 + 640 >> 2] = 0;
    HEAP32[$8 + 632 >> 2] = 4340;
    HEAP32[$8 + 628 >> 2] = 3466;
    HEAP32[$8 + 624 >> 2] = 4563;
    HEAP8[$0 + 16 | 0] = 0;
    break block1;
   }
   if ($5 >>> 0 < $6 >>> 0) {
    HEAP32[$0 >> 2] = 3;
    $1 = $8 + 32 | 0;
    HEAP32[$1 >> 2] = $6;
    HEAP32[$1 + 4 >> 2] = 0;
    $1 = $8 + 24 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = 0;
    HEAP32[$8 + 12 >> 2] = 349;
    HEAP32[$8 + 16 >> 2] = 0;
    HEAP32[$8 + 8 >> 2] = 4340;
    HEAP32[$8 + 4 >> 2] = 3466;
    HEAP32[$8 >> 2] = 3394;
    HEAP8[$0 + 16 | 0] = 0;
    break block1;
   }
   $11 = 64;
   while (1) {
    $9 = ($8 + 1168 | 0) + $12 | 0;
    HEAP32[$9 + 28 >> 2] = $9 + 24;
    HEAP32[$9 + 20 >> 2] = $9 + 16;
    HEAP32[$9 + 12 >> 2] = $9 + 8;
    HEAP32[$9 + 4 >> 2] = $9;
    $12 = $12 + 32 | 0;
    $9 = $10 - 1 | 0;
    $11 = $11 - 4 | 0;
    $10 = $11 >>> 0 < 4294967292 ? $9 + 1 | 0 : $9;
    if ($10 | $11) {
     continue
    }
    break;
   };
   memset($8 + 656 | 0, 512);
   $11 = $2 - 1 | 0;
   $10 = ($11 | 0) == -1 ? -1 : 0;
   $9 = ($1 + $2 | 0) - 1 | 0;
   $2 = 0;
   block5 : {
    while (1) {
     $1 = HEAPU8[$9 | 0];
     if ($1) {
      if ($1 >>> 0 >= 64) {
       HEAP32[$0 >> 2] = 3;
       $2 = $8 + 608 | 0;
       HEAP32[$2 >> 2] = $1;
       HEAP32[$2 + 4 >> 2] = 0;
       $1 = $8 + 600 | 0;
       HEAP32[$1 >> 2] = $11;
       HEAP32[$1 + 4 >> 2] = $10;
       HEAP32[$8 + 588 >> 2] = 52;
       HEAP32[$8 + 592 >> 2] = 0;
       HEAP32[$8 + 584 >> 2] = 4340;
       HEAP32[$8 + 580 >> 2] = 3417;
       HEAP32[$8 + 576 >> 2] = 4477;
       break block5;
      }
      $12 = $1 << 3;
      $13 = $12 + ($8 + 1168 | 0) | 0;
      HEAP32[HEAP32[$13 + 4 >> 2] >> 2] = $7;
      HEAP16[$7 + 6 >> 1] = $1;
      HEAP16[$7 + 4 >> 1] = $11;
      $1 = $12 + ($8 + 656 | 0) | 0;
      $12 = HEAP32[$1 >> 2];
      $15 = HEAP32[$1 + 4 >> 2];
      $12 = $12 + 1 | 0;
      $15 = $12 ? $15 : $15 + 1 | 0;
      HEAP32[$1 >> 2] = $12;
      HEAP32[$1 + 4 >> 2] = $15;
      HEAP32[$13 + 4 >> 2] = $7;
      $2 = $2 + 1 | 0;
      $14 = $2 ? $14 : $14 + 1 | 0;
      $7 = $7 + 8 | 0;
     }
     $9 = $9 - 1 | 0;
     $1 = $10 - 1 | 0;
     $11 = $11 - 1 | 0;
     $10 = ($11 | 0) != -1 ? $1 + 1 | 0 : $1;
     if (($10 & $11) != -1) {
      continue
     }
     break;
    };
    $12 = 0;
    $11 = 64;
    $10 = 0;
    $1 = 0;
    while (1) {
     $9 = ($8 + 1168 | 0) + $12 | 0;
     HEAP32[HEAP32[$9 + 4 >> 2] >> 2] = $1;
     HEAP32[HEAP32[$9 + 12 >> 2] >> 2] = HEAP32[$9 >> 2];
     HEAP32[HEAP32[$9 + 20 >> 2] >> 2] = HEAP32[$9 + 8 >> 2];
     HEAP32[HEAP32[$9 + 28 >> 2] >> 2] = HEAP32[$9 + 16 >> 2];
     $12 = $12 + 32 | 0;
     $1 = HEAP32[$9 + 24 >> 2];
     $9 = $10 - 1 | 0;
     $11 = $11 - 4 | 0;
     $10 = $11 >>> 0 < 4294967292 ? $9 + 1 | 0 : $9;
     if ($10 | $11) {
      continue
     }
     break;
    };
    block23 : {
     block29 : {
      block26 : {
       block20 : {
        block18 : {
         block17 : {
          if ($1) {
           $9 = HEAP32[$1 >> 2];
           if ($9) {
            $11 = HEAPU16[$1 + 6 >> 1];
            $13 = $1;
            while (1) {
             block8 : {
              $12 = HEAPU16[$9 + 6 >> 1];
              $10 = $11 & 65535;
              if ($12 >>> 0 < $10 >>> 0) {
               break block8
              }
              $15 = HEAPU16[$9 + 4 >> 1];
              $13 = HEAPU16[$13 + 4 >> 1];
              if (($10 | 0) == ($12 | 0)) {
               if ($13 >>> 0 > $15 >>> 0) {
                break block8
               }
               $12 = $11;
              }
              HEAP32[$0 >> 2] = 3;
              HEAP32[$8 + 560 >> 2] = $15;
              HEAP32[$8 + 556 >> 2] = $12 & 65535;
              HEAP32[$8 + 552 >> 2] = $13;
              HEAP32[$8 + 548 >> 2] = $11 & 65535;
              HEAP32[$8 + 540 >> 2] = 88;
              HEAP32[$8 + 544 >> 2] = 0;
              HEAP32[$8 + 536 >> 2] = 4340;
              HEAP32[$8 + 532 >> 2] = 3417;
              HEAP32[$8 + 528 >> 2] = 5769;
              break block5;
             }
             $11 = $12;
             $13 = $9;
             $9 = HEAP32[$9 >> 2];
             if ($9) {
              continue
             }
             break;
            };
           }
           block15 : {
            block16 : {
             block11 : {
              block13 : {
               block12 : {
                if (!(!$14 & ($2 | 0) == 1)) {
                 $9 = $8 + 1144 | 0;
                 $2 = 63;
                 $14 = 0;
                 while (1) {
                  $12 = $9 + 16 | 0;
                  $13 = HEAP32[$12 >> 2];
                  $12 = $17 + HEAP32[$12 + 4 >> 2] | 0;
                  $11 = $13 + $16 | 0;
                  $10 = $11 >>> 0 < $16 >>> 0 ? $12 + 1 | 0 : $12;
                  if ($11 & 1) {
                   break block11
                  }
                  $12 = ($10 & 1) << 31 | $11 >>> 1;
                  $13 = $9 + 8 | 0;
                  $11 = $12 + HEAP32[$13 >> 2] | 0;
                  $13 = HEAP32[$13 + 4 >> 2] + ($10 >>> 1 | 0) | 0;
                  $10 = $11 >>> 0 < $12 >>> 0 ? $13 + 1 | 0 : $13;
                  if ($11 & 1) {
                   break block12
                  }
                  $12 = HEAP32[$9 + 4 >> 2] + ($10 >>> 1 | 0) | 0;
                  $13 = $12 + 1 | 0;
                  $15 = $12;
                  $12 = ($10 & 1) << 31 | $11 >>> 1;
                  $11 = $12 + HEAP32[$9 >> 2] | 0;
                  $10 = $11 >>> 0 < $12 >>> 0 ? $13 : $15;
                  if ($11 & 1) {
                   break block13
                  }
                  $9 = $9 - 24 | 0;
                  $16 = ($10 & 1) << 31 | $11 >>> 1;
                  $17 = $10 >>> 1 | 0;
                  $12 = $14 - 1 | 0;
                  $2 = $2 - 3 | 0;
                  $14 = $2 >>> 0 < 4294967293 ? $12 + 1 | 0 : $12;
                  if ($2 | $14) {
                   continue
                  }
                  break;
                 };
                 $2 = HEAP32[$8 + 656 >> 2];
                 $9 = HEAP32[$8 + 660 >> 2];
                 if (!(($11 | 0) != 2 | ($10 | 0) != 0 | ($2 | $9))) {
                  break block15
                 }
                 HEAP32[$0 >> 2] = 9;
                 HEAP32[$8 + 504 >> 2] = $2;
                 HEAP32[$8 + 508 >> 2] = $9;
                 HEAP32[$8 + 496 >> 2] = $16;
                 HEAP32[$8 + 500 >> 2] = $17;
                 break block16;
                }
                $4 = HEAPU16[$1 + 4 >> 1];
                $2 = $4 >>> 28 | 0;
                $6 = HEAPU16[$1 + 6 >> 1];
                $1 = $6 + ($4 << 4) | 0;
                $2 = $1 >>> 0 < $6 >>> 0 ? $2 + 1 | 0 : $2;
                if (!$2 & $1 >>> 0 > 32767 | $2) {
                 break block17
                }
                $0 = $5 & 31;
                if (($5 & 63) >>> 0 >= 32) {
                 $10 = 1 << $0;
                 $2 = 0;
                } else {
                 $2 = 1 << $0;
                 $10 = $2 - 1 & 1 >>> 32 - $0;
                }
                $11 = $2 - 1 | 0;
                $0 = $10 - 1 | 0;
                $10 = ($11 | 0) != -1 ? $0 + 1 | 0 : $0;
                while (1) {
                 (wasm2js_i32$0 = (HuffmanReverseMask($11, $10, $5, 0) << 1) + $3 | 0, wasm2js_i32$1 = $1), HEAP16[wasm2js_i32$0 >> 1] = wasm2js_i32$1;
                 $0 = $10 - 1 | 0;
                 $11 = $11 - 1 | 0;
                 $10 = ($11 | 0) != -1 ? $0 + 1 | 0 : $0;
                 if (($10 & $11) != -1) {
                  continue
                 }
                 break;
                };
                $9 = $3;
                break block1;
               }
               $1 = $14 - 1 | 0;
               $2 = $2 - 1 | 0;
               $14 = ($2 | 0) != -1 ? $1 + 1 | 0 : $1;
               break block11;
              }
              $1 = $14 - 1 | 0;
              $2 = $2 - 2 | 0;
              $14 = $2 >>> 0 < 4294967294 ? $1 + 1 | 0 : $1;
             }
             HEAP32[$0 >> 2] = 9;
             HEAP32[$8 + 520 >> 2] = $11;
             HEAP32[$8 + 524 >> 2] = $10;
             HEAP32[$8 + 512 >> 2] = $2;
             HEAP32[$8 + 516 >> 2] = $14;
            }
            $1 = $0 + 16 | 0;
            HEAP8[$1 | 0] = 0;
            $9 = 0;
            if (HEAP32[$0 >> 2]) {
             break block1
            }
            HEAP32[$0 >> 2] = 3;
            HEAP32[$8 + 476 >> 2] = 381;
            HEAP32[$8 + 480 >> 2] = 0;
            HEAP32[$8 + 472 >> 2] = 4340;
            HEAP32[$8 + 468 >> 2] = 3466;
            HEAP32[$8 + 464 >> 2] = 4602;
            HEAP8[$1 | 0] = 0;
            break block1;
           }
           $2 = $5 - 16 | 0;
           $9 = $2 >>> 0 >= 4294967280 ? -1 : 0;
           if (($9 | 0) == -1 & $2 >>> 0 < 4294967284 | ($9 | 0) != -1) {
            break block18
           }
           $2 = $6 - 16 | 0;
           $9 = $2 >>> 0 >= 4294967280 ? -1 : 0;
           if (($9 | 0) == -1 & $2 >>> 0 < 4294967284 | ($9 | 0) != -1) {
            break block18
           }
           $9 = 0;
           $13 = 0;
           $16 = 0;
           $17 = 0;
           while (1) {
            $2 = HEAPU16[$1 + 6 >> 1];
            if ($9) {
             $12 = HEAPU16[$9 + 6 >> 1];
             $2 = $2 >>> 0 > $12 >>> 0 ? $2 : $12;
            }
            $2 = $2 & 65535;
            $12 = $2 >>> 0 > $5 >>> 0;
            $22 = $12 ? $2 : $5;
            $19 = $12 ? $2 - $6 | 0 : 0;
            $23 = $22 - $19 | 0;
            $21 = $12 ? 0 - ($2 >>> 0 < $6 >>> 0) | 0 : 0;
            $26 = 0 - ($21 + ($19 >>> 0 > $22 >>> 0) | 0) | 0;
            $2 = $23 & 31;
            if (($23 & 63) >>> 0 >= 32) {
             $18 = 1 << $2;
             $12 = 0;
            } else {
             $12 = 1 << $2;
             $18 = $12 - 1 & 1 >>> 32 - $2;
            }
            $20 = $12;
            $24 = $16 + $20 | 0;
            $2 = $17 + $18 | 0;
            $25 = $16 >>> 0 > $24 >>> 0 ? $2 + 1 | 0 : $2;
            if (!$25 & $4 >>> 0 < $24 >>> 0 | $25) {
             break block20
            }
            $15 = $7;
            $12 = $9;
            while (1) {
             block25 : {
              block21 : {
               if (!$12) {
                break block21
               }
               $11 = HEAPU16[$12 + 6 >> 1];
               if (!$21 & $19 >>> 0 >= $11 >>> 0 | $21) {
                break block21
               }
               $7 = HEAPU16[$12 + 4 >> 1];
               $2 = $6 & 31;
               if (($6 & 63) >>> 0 >= 32) {
                $10 = $7 << $2;
                $2 = 0;
               } else {
                $10 = (1 << $2) - 1 & $7 >>> 32 - $2;
                $2 = $7 << $2;
               }
               if (!(($10 | 0) == ($17 | 0) & $2 >>> 0 < $16 >>> 0 | $10 >>> 0 < $17 >>> 0)) {
                HEAP32[$0 >> 2] = 3;
                $1 = $8 + 448 | 0;
                HEAP32[$1 >> 2] = $16;
                HEAP32[$1 + 4 >> 2] = $17;
                $1 = $8 + 440 | 0;
                HEAP32[$1 >> 2] = $2;
                HEAP32[$1 + 4 >> 2] = $10;
                HEAP32[$8 + 428 >> 2] = 252;
                HEAP32[$8 + 432 >> 2] = 0;
                HEAP32[$8 + 424 >> 2] = 4340;
                HEAP32[$8 + 420 >> 2] = 3442;
                HEAP32[$8 + 416 >> 2] = 3255;
                HEAP8[$0 + 16 | 0] = 0;
                break block23;
               }
               $7 = $10 - (($2 >>> 0 < $16 >>> 0) + $17 | 0) - (($11 >>> 0 < $19 >>> 0) + $21) | 0;
               $14 = $7 + 1 | 0;
               $9 = $7;
               $7 = $11 - $19 | 0;
               $10 = $7;
               $7 = ($2 - $16 | 0) + $7 | 0;
               $2 = $10 >>> 0 > $7 >>> 0 ? $14 : $9;
               $9 = $7 + 32768 | 0;
               $10 = $9 >>> 0 < 32768 ? $2 + 1 | 0 : $2;
               if (!(!$10 & $9 >>> 0 >= 65536 | ($10 | 0) != 0)) {
                $12 = HEAP32[$12 >> 2];
                break block25;
               }
               HEAP32[$0 >> 2] = 3;
               $1 = $8 + 408 | 0;
               HEAP32[$1 >> 2] = $7;
               HEAP32[$1 + 4 >> 2] = $2;
               HEAP32[$8 + 396 >> 2] = 257;
               HEAP32[$8 + 400 >> 2] = 0;
               HEAP32[$8 + 392 >> 2] = 4340;
               HEAP32[$8 + 388 >> 2] = 3442;
               HEAP32[$8 + 384 >> 2] = 3717;
               HEAP8[$0 + 16 | 0] = 0;
               break block23;
              }
              $2 = HEAPU16[$1 + 4 >> 1];
              $9 = $2 >>> 28 | 0;
              $2 = $2 << 4;
              $11 = HEAPU16[$1 + 6 >> 1];
              $7 = $2 + ($11 - $19 | 0) | 0;
              $9 = $9 - (($11 >>> 0 < $19 >>> 0) + $21 | 0) | 0;
              $2 = $2 >>> 0 > $7 >>> 0 ? $9 + 1 | 0 : $9;
              $9 = $7 + 32768 | 0;
              $10 = $9 >>> 0 < 32768 ? $2 + 1 | 0 : $2;
              if (!$10 & $9 >>> 0 >= 65536 | $10) {
               break block26
              }
              $1 = HEAP32[$1 >> 2];
             }
             $9 = $22 - $11 | 0;
             $2 = $9 & 31;
             if (($9 & 63) >>> 0 >= 32) {
              $10 = 1 << $2;
              $2 = 0;
             } else {
              $9 = 1 << $2;
              $10 = $9 - 1 & 1 >>> 32 - $2;
              $2 = $9;
             }
             $14 = $10;
             if (!(($10 | 0) == ($18 | 0) & $2 >>> 0 <= $20 >>> 0 | $10 >>> 0 < $18 >>> 0)) {
              HEAP32[$0 >> 2] = 3;
              $1 = $8 + 304 | 0;
              HEAP32[$1 >> 2] = $2;
              HEAP32[$1 + 4 >> 2] = $10;
              $1 = $8 + 296 | 0;
              HEAP32[$1 >> 2] = $20;
              HEAP32[$1 + 4 >> 2] = $18;
              HEAP32[$8 + 284 >> 2] = 269;
              HEAP32[$8 + 288 >> 2] = 0;
              HEAP32[$8 + 280 >> 2] = 4340;
              HEAP32[$8 + 276 >> 2] = 3442;
              HEAP32[$8 + 272 >> 2] = 6024;
              HEAP8[$0 + 16 | 0] = 0;
              break block23;
             }
             $9 = $18 - 1 | 0;
             $11 = $20 - 1 | 0;
             $10 = ($11 | 0) != -1 ? $9 + 1 | 0 : $9;
             $9 = $20;
             $20 = $9 - $2 | 0;
             $18 = $18 - (($2 >>> 0 > $9 >>> 0) + $14 | 0) | 0;
             while (1) {
              (wasm2js_i32$0 = (HuffmanReverseMask($11, $10, $23, $26) + $16 << 1) + $3 | 0, wasm2js_i32$1 = $7), HEAP16[wasm2js_i32$0 >> 1] = wasm2js_i32$1;
              $9 = $10 - 1 | 0;
              $11 = $11 - 1 | 0;
              $10 = ($11 | 0) != -1 ? $9 + 1 | 0 : $9;
              $9 = $14 - 1 | 0;
              $2 = $2 - 1 | 0;
              $14 = ($2 | 0) != -1 ? $9 + 1 | 0 : $9;
              if ($2 | $14) {
               continue
              }
              break;
             };
             if ($18 | $20) {
              continue
             }
             break;
            };
            HEAP16[$15 + 6 >> 1] = $19;
            HEAP32[$15 >> 2] = 0;
            $2 = $6 & 31;
            if (($6 & 63) >>> 0 >= 32) {
             $2 = $17 >>> $2 | 0
            } else {
             $2 = ((1 << $2) - 1 & $17) << 32 - $2 | $16 >>> $2
            }
            HEAP16[$15 + 4 >> 1] = $2;
            $9 = $15;
            if ($12) {
             if (!$13) {
              break block29
             }
             HEAP32[$13 >> 2] = $9;
             $9 = $12;
            }
            $7 = $15 + 8 | 0;
            $13 = $15;
            $16 = $24;
            $17 = $25;
            if ($19 | $21) {
             continue
            }
            break;
           };
           if (HEAP32[$9 >> 2]) {
            HEAP32[$0 >> 2] = 3;
            HEAP32[$8 + 340 >> 2] = HEAPU16[$9 + 6 >> 1];
            HEAP32[$8 + 332 >> 2] = 315;
            HEAP32[$8 + 336 >> 2] = 0;
            HEAP32[$8 + 328 >> 2] = 4340;
            HEAP32[$8 + 324 >> 2] = 3442;
            HEAP32[$8 + 320 >> 2] = 4526;
            HEAP8[$0 + 16 | 0] = 0;
            break block23;
           }
           $1 = $5 & 31;
           if (($5 & 63) >>> 0 >= 32) {
            $10 = 1 << $1;
            $1 = 0;
           } else {
            $2 = 1 << $1;
            $10 = $2 - 1 & 1 >>> 32 - $1;
            $1 = $2;
           }
           if (($10 | 0) == ($17 | 0) & $1 >>> 0 > $16 >>> 0 | $10 >>> 0 > $17 >>> 0) {
            break block23
           }
           $9 = (($16 << 1) + $3 | 0) - ($1 << 1) | 0;
           break block1;
          }
          HEAP32[$0 >> 2] = 3;
          HEAP32[$8 + 92 >> 2] = 73;
          HEAP32[$8 + 96 >> 2] = 0;
          HEAP32[$8 + 88 >> 2] = 4340;
          HEAP32[$8 + 84 >> 2] = 3417;
          HEAP32[$8 + 80 >> 2] = 4549;
          break block5;
         }
         HEAP32[$0 >> 2] = 3;
         $3 = $8 + 136 | 0;
         HEAP32[$3 >> 2] = $1;
         HEAP32[$3 + 4 >> 2] = $2;
         HEAP32[$8 + 124 >> 2] = 365;
         HEAP32[$8 + 128 >> 2] = 0;
         HEAP32[$8 + 120 >> 2] = 4340;
         HEAP32[$8 + 116 >> 2] = 3466;
         HEAP32[$8 + 112 >> 2] = 3717;
         HEAP8[$0 + 16 | 0] = 0;
         $9 = 0;
         break block1;
        }
        HEAP32[$0 >> 2] = 3;
        $1 = $8 + 208 | 0;
        HEAP32[$1 >> 2] = $6;
        HEAP32[$1 + 4 >> 2] = 0;
        $1 = $8 + 200 | 0;
        HEAP32[$1 >> 2] = $5;
        HEAP32[$1 + 4 >> 2] = 0;
        HEAP32[$8 + 188 >> 2] = 195;
        HEAP32[$8 + 192 >> 2] = 0;
        HEAP32[$8 + 184 >> 2] = 4340;
        HEAP32[$8 + 180 >> 2] = 3442;
        HEAP32[$8 + 176 >> 2] = 3320;
        HEAP8[$0 + 16 | 0] = 0;
        break block23;
       }
       HEAP32[$0 >> 2] = 3;
       $1 = $8 + 264 | 0;
       HEAP32[$1 >> 2] = $4;
       HEAP32[$1 + 4 >> 2] = 0;
       $1 = $8 + 256 | 0;
       HEAP32[$1 >> 2] = $20;
       HEAP32[$1 + 4 >> 2] = $18;
       $1 = $8 + 248 | 0;
       HEAP32[$1 >> 2] = $16;
       HEAP32[$1 + 4 >> 2] = $17;
       HEAP32[$8 + 236 >> 2] = 242;
       HEAP32[$8 + 240 >> 2] = 0;
       HEAP32[$8 + 232 >> 2] = 4340;
       HEAP32[$8 + 228 >> 2] = 3442;
       HEAP32[$8 + 224 >> 2] = 3883;
       HEAP8[$0 + 16 | 0] = 0;
       break block23;
      }
      HEAP32[$0 >> 2] = 3;
      $1 = $8 + 376 | 0;
      HEAP32[$1 >> 2] = $7;
      HEAP32[$1 + 4 >> 2] = $2;
      HEAP32[$8 + 364 >> 2] = 266;
      HEAP32[$8 + 368 >> 2] = 0;
      HEAP32[$8 + 360 >> 2] = 4340;
      HEAP32[$8 + 356 >> 2] = 3442;
      HEAP32[$8 + 352 >> 2] = 3717;
      HEAP8[$0 + 16 | 0] = 0;
      break block23;
     }
     wasm2js_trap();
    }
    $9 = 0;
    if (HEAP32[$0 >> 2]) {
     break block1
    }
    HEAP32[$0 >> 2] = 3;
    HEAP32[$8 + 156 >> 2] = 388;
    HEAP32[$8 + 160 >> 2] = 0;
    HEAP32[$8 + 152 >> 2] = 4340;
    HEAP32[$8 + 148 >> 2] = 3466;
    HEAP32[$8 + 144 >> 2] = 4602;
    HEAP8[$0 + 16 | 0] = 0;
    break block1;
   }
   $1 = $0 + 16 | 0;
   HEAP8[$1 | 0] = 0;
   HEAP32[$0 >> 2] = 3;
   HEAP32[$8 + 60 >> 2] = 352;
   HEAP32[$8 + 64 >> 2] = 0;
   HEAP32[$8 + 56 >> 2] = 4340;
   HEAP32[$8 + 52 >> 2] = 3466;
   HEAP32[$8 + 48 >> 2] = 4549;
   HEAP8[$1 | 0] = 0;
   $9 = 0;
  }
  __stack_pointer = $8 + 1680 | 0;
  return $9;
 }
 
 function HuffmanDecodeLengthTable($0, $1, $2, $3) {
  var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0;
  $13 = __stack_pointer - 1120 | 0;
  __stack_pointer = $13;
  HEAP8[$13 + 1104 | 0] = 0;
  $11 = $13 + 1096 | 0;
  HEAP32[$11 >> 2] = 0;
  HEAP32[$11 + 4 >> 2] = 0;
  $11 = $13 + 1088 | 0;
  HEAP32[$11 >> 2] = 0;
  HEAP32[$11 + 4 >> 2] = 0;
  HEAP32[$13 + 1080 >> 2] = 0;
  HEAP32[$13 + 1084 >> 2] = 0;
  HEAP32[$13 + 1072 >> 2] = 0;
  HEAP32[$13 + 1076 >> 2] = 0;
  memset($13 + 784 | 0, 280);
  memset($13 + 208 | 0, 576);
  block1 : {
   if (HEAP32[$0 >> 2]) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$13 + 188 >> 2] = 425;
    HEAP32[$13 + 192 >> 2] = 0;
    HEAP32[$13 + 184 >> 2] = 4340;
    HEAP32[$13 + 180 >> 2] = 4016;
    HEAP32[$13 + 176 >> 2] = 4563;
    HEAP8[$0 + 16 | 0] = 0;
    break block1;
   }
   $11 = HEAP32[$1 + 4 >> 2];
   $10 = $11 >>> 3 | 0;
   $4 = HEAP32[$1 >> 2];
   $11 = ($11 & 7) << 29 | $4 >>> 3;
   $6 = $4 & 7;
   $15 = HEAP32[$1 + 16 >> 2];
   $8 = HEAP32[$1 + 8 >> 2];
   $9 = HEAP32[$1 + 12 >> 2];
   if (($9 | 0) < 0) {
    $4 = 1
   } else {
    $4 = ($9 | 0) <= 0 & $8 >>> 0 <= 2
   }
   block3 : {
    if (!$4) {
     $4 = $9 - 1 | 0;
     $9 = $8 - 3 | 0;
     $14 = $9 >>> 0 < 4294967293 ? $4 + 1 | 0 : $4;
     break block3;
    }
    $4 = HEAP32[$15 >> 2];
    $20 = $9 + 1 | 0;
    $7 = $9;
    $9 = $8 + 29 | 0;
    $14 = $9 >>> 0 < 29 ? $20 : $7;
    $8 = $9 & 31;
    if (($9 & 63) >>> 0 >= 32) {
     $16 = $4 << $8;
     $4 = 0;
    } else {
     $16 = (1 << $8) - 1 & $4 >>> 32 - $8;
     $4 = $4 << $8;
    }
    $4 = $4 + $11 | 0;
    $10 = $10 + $16 | 0;
    $10 = $4 >>> 0 < $11 >>> 0 ? $10 + 1 | 0 : $10;
    $11 = $4;
    $15 = $15 + 4 | 0;
   }
   block45 : {
    block9 : {
     block6 : {
      if ($6 >>> 0 <= 1) {
       if (($6 | 0) == 1) {
        break block6
       }
       $0 = 0;
       $18 = $3 ? Math_clz32($3) ^ 31 : 0;
       $4 = ($18 << 3) + 6152 | 0;
       $7 = HEAP32[$4 >> 2];
       $8 = HEAP32[$4 + 4 >> 2];
       $4 = $8;
       block7 : {
        if (($3 | 0) == ($7 | 0) & !$4) {
         break block7
        }
        $5 = $4 - ($3 >>> 0 > $7 >>> 0) | 0;
        $0 = $7 - $3 | 0;
        $6 = $0 & 7;
        $4 = 0;
        if (!((0 - (($3 >>> 0 < $7 >>> 0) + $8 | 0) | 0) == -1 & $3 - $7 >>> 0 > 4294967288)) {
         $17 = $0 & -8;
         $8 = 0;
         $7 = $2;
         while (1) {
          HEAP8[$7 | 0] = $18;
          HEAP8[$7 + 7 | 0] = $18;
          HEAP8[$7 + 6 | 0] = $18;
          HEAP8[$7 + 5 | 0] = $18;
          HEAP8[$7 + 4 | 0] = $18;
          HEAP8[$7 + 3 | 0] = $18;
          HEAP8[$7 + 2 | 0] = $18;
          HEAP8[$7 + 1 | 0] = $18;
          $7 = $7 + 8 | 0;
          $4 = $4 + 8 | 0;
          $8 = $4 >>> 0 < 8 ? $8 + 1 | 0 : $8;
          if (($4 | 0) != ($17 | 0) | ($8 | 0) != ($5 | 0)) {
           continue
          }
          break;
         };
        }
        if (!$6) {
         break block7
        }
        $7 = $2 + $4 | 0;
        while (1) {
         HEAP8[$7 | 0] = $18;
         $7 = $7 + 1 | 0;
         $4 = $12 - 1 | 0;
         $6 = $6 - 1 | 0;
         $12 = ($6 | 0) != -1 ? $4 + 1 | 0 : $4;
         if ($12 | $6) {
          continue
         }
         break;
        };
       }
       if ($5 | !$5 & $0 >>> 0 >= $3 >>> 0) {
        break block9
       }
       $17 = $18 + 1 | 0;
       $8 = $5;
       $12 = 0;
       $4 = $0;
       $6 = $3 - $4 & 7;
       if ($6) {
        $4 = $4 + $6 | 0;
        $8 = $4 >>> 0 < $6 >>> 0 ? $5 + 1 | 0 : $5;
        $7 = $0 + $2 | 0;
        while (1) {
         HEAP8[$7 | 0] = $17;
         $7 = $7 + 1 | 0;
         $12 = $12 - 1 | 0;
         $6 = $6 - 1 | 0;
         $12 = ($6 | 0) != -1 ? $12 + 1 | 0 : $12;
         if ($12 | $6) {
          continue
         }
         break;
        };
       }
       if (($5 - ($0 >>> 0 < $3 >>> 0) | 0) == -1 & $0 - $3 >>> 0 > 4294967288) {
        break block9
       }
       $6 = $3 - $4 | 0;
       $12 = 0 - (($3 >>> 0 < $4 >>> 0) + $8 | 0) | 0;
       $7 = $2 + $4 | 0;
       while (1) {
        HEAP8[$7 | 0] = $17;
        HEAP8[$7 + 7 | 0] = $17;
        HEAP8[$7 + 6 | 0] = $17;
        HEAP8[$7 + 5 | 0] = $17;
        HEAP8[$7 + 4 | 0] = $17;
        HEAP8[$7 + 3 | 0] = $17;
        HEAP8[$7 + 2 | 0] = $17;
        HEAP8[$7 + 1 | 0] = $17;
        $7 = $7 + 8 | 0;
        $0 = $12 - 1 | 0;
        $6 = $6 - 8 | 0;
        $12 = $6 >>> 0 < 4294967288 ? $0 + 1 | 0 : $0;
        if ($12 | $6) {
         continue
        }
        break;
       };
       break block9;
      }
      HEAP32[$0 >> 2] = 9;
      HEAP32[$13 >> 2] = $6;
      HEAP32[$13 + 4 >> 2] = 0;
      HEAP8[$0 + 16 | 0] = 0;
      break block1;
     }
     $4 = 4;
     $8 = 0;
     $7 = $13 + 1072 | 0;
     $19 = 33;
     while (1) {
      $6 = ($10 & 1) << 31 | $11 >>> 1;
      $12 = $10 >>> 1 | 0;
      block12 : {
       if (($14 | 0) >= 0 ? (($14 | 0) > 0 ? 1 : $9) : 0) {
        $10 = $14 - 1 | 0;
        $9 = $9 - 1 | 0;
        $14 = ($9 | 0) != -1 ? $10 + 1 | 0 : $10;
        break block12;
       }
       $10 = HEAP32[$15 >> 2];
       $9 = $9 + 31 | 0;
       $14 = $9 >>> 0 < 31 ? $14 + 1 | 0 : $14;
       $17 = $9 & 31;
       if (($9 & 63) >>> 0 >= 32) {
        $16 = $10 << $17;
        $10 = 0;
       } else {
        $16 = (1 << $17) - 1 & $10 >>> 32 - $17;
        $10 = $10 << $17;
       }
       $10 = $10 + $6 | 0;
       $12 = $12 + $16 | 0;
       $12 = $6 >>> 0 > $10 >>> 0 ? $12 + 1 | 0 : $12;
       $6 = $10;
       $15 = $15 + 4 | 0;
      }
      block14 : {
       if (!($11 & 1)) {
        $11 = $6;
        $10 = $12;
        break block14;
       }
       $11 = ($12 & 7) << 29 | $6 >>> 3;
       $10 = $12 >>> 3 | 0;
       $12 = $6 & 7;
       if (($14 | 0) < 0) {
        $6 = 1
       } else {
        $6 = ($14 | 0) <= 0 & $9 >>> 0 <= 2
       }
       block16 : {
        if (!$6) {
         $6 = $14 - 1 | 0;
         $9 = $9 - 3 | 0;
         $14 = $9 >>> 0 < 4294967293 ? $6 + 1 | 0 : $6;
         break block16;
        }
        $6 = HEAP32[$15 >> 2];
        $9 = $9 + 29 | 0;
        $14 = $9 >>> 0 < 29 ? $14 + 1 | 0 : $14;
        $17 = $9 & 31;
        if (($9 & 63) >>> 0 >= 32) {
         $16 = $6 << $17;
         $6 = 0;
        } else {
         $16 = (1 << $17) - 1 & $6 >>> 32 - $17;
         $6 = $6 << $17;
        }
        $6 = $6 + $11 | 0;
        $10 = $10 + $16 | 0;
        $10 = $6 >>> 0 < $11 >>> 0 ? $10 + 1 | 0 : $10;
        $11 = $6;
        $15 = $15 + 4 | 0;
       }
       $4 = !$8 & $4 >>> 0 <= $12 >>> 0;
       $8 = $4;
       $4 = $4 + $12 | 0;
       $8 = $8 >>> 0 > $4 >>> 0;
      }
      HEAP8[$7 | 0] = $4;
      $7 = $7 + 1 | 0;
      $5 = $5 - 1 | 0;
      $19 = $19 - 1 | 0;
      $5 = ($19 | 0) != -1 ? $5 + 1 | 0 : $5;
      if ($5 | $19) {
       continue
      }
      break;
     };
     $23 = HuffmanCreateDecodeTables($0, $13 + 1072 | 0, 33, $13 + 208 | 0, 288, 8, 4, $13 + 784 | 0);
     if (HEAP32[$0 >> 2]) {
      break block1
     }
     if (!$3) {
      break block9
     }
     $19 = 8;
     $6 = 0;
     $12 = 0;
     while (1) {
      $4 = HEAP16[(($11 & 255) << 1) + $23 >> 1];
      $8 = $4 >> 31;
      block18 : {
       if (($4 | 0) >= 0) {
        $5 = $15;
        break block18;
       }
       $8 = $4 & 15;
       $5 = $10 >>> $8 | 0;
       $11 = ((1 << $8) - 1 & $10) << 32 - $8 | $11 >>> $8;
       $10 = $5;
       $5 = $9;
       $9 = $9 - $8 | 0;
       $14 = $14 - ($8 >>> 0 > $5 >>> 0) | 0;
       if (($14 | 0) < -1) {
        $5 = 1
       } else {
        $5 = ($14 | 0) < 0
       }
       block20 : {
        if (!$5) {
         $5 = $15;
         break block20;
        }
        $5 = $15 + 4 | 0;
        $15 = HEAP32[$15 >> 2];
        $9 = $9 + 32 | 0;
        $14 = $9 >>> 0 < 32 ? $14 + 1 | 0 : $14;
        $8 = $9 & 31;
        if (($9 & 63) >>> 0 >= 32) {
         $16 = $15 << $8;
         $15 = 0;
        } else {
         $16 = (1 << $8) - 1 & $15 >>> 32 - $8;
         $15 = $15 << $8;
        }
        $15 = $15 + $11 | 0;
        $10 = $10 + $16 | 0;
        $10 = $11 >>> 0 > $15 >>> 0 ? $10 + 1 | 0 : $10;
        $11 = $15;
       }
       $15 = (($4 & 2147483632) << 1) + $23 | 0;
       $7 = HEAP16[$15 + (($11 & 1) << 1) >> 1];
       $4 = $7;
       $8 = $4 >> 31;
       if (($4 | 0) >= 0) {
        break block18
       }
       while (1) {
        $8 = $4 & 15;
        $4 = $10 >>> $8 | 0;
        $11 = ((1 << $8) - 1 & $10) << 32 - $8 | $11 >>> $8;
        $10 = $4;
        $4 = $9;
        $9 = $4 - $8 | 0;
        $14 = $14 - ($4 >>> 0 < $8 >>> 0) | 0;
        if (($14 | 0) < 0) {
         $4 = HEAP32[$5 >> 2];
         $9 = $9 + 32 | 0;
         $14 = $9 >>> 0 < 32 ? $14 + 1 | 0 : $14;
         $8 = $9 & 31;
         if (($9 & 63) >>> 0 >= 32) {
          $16 = $4 << $8;
          $4 = 0;
         } else {
          $16 = (1 << $8) - 1 & $4 >>> 32 - $8;
          $4 = $4 << $8;
         }
         $4 = $4 + $11 | 0;
         $10 = $10 + $16 | 0;
         $10 = $4 >>> 0 < $11 >>> 0 ? $10 + 1 | 0 : $10;
         $5 = $5 + 4 | 0;
         $11 = $4;
        }
        $15 = (($7 & 65520) << 16 >> 16 << 1) + $15 | 0;
        $7 = HEAP16[$15 + (($11 & 1) << 1) >> 1];
        $4 = $7;
        $8 = $4 >> 31;
        if (($4 | 0) < 0) {
         continue
        }
        break;
       };
      }
      $7 = $4 & 15;
      $15 = $10 >>> $7 | 0;
      $11 = ((1 << $7) - 1 & $10) << 32 - $7 | $11 >>> $7;
      $10 = $15;
      $15 = $9;
      $9 = $9 - $7 | 0;
      $14 = $14 - ($7 >>> 0 > $15 >>> 0) | 0;
      if (($14 | 0) < -1) {
       $15 = 1
      } else {
       $15 = ($14 | 0) < 0
      }
      block23 : {
       if (!$15) {
        $15 = $5;
        break block23;
       }
       $15 = $5 + 4 | 0;
       $5 = HEAP32[$5 >> 2];
       $9 = $9 + 32 | 0;
       $14 = $9 >>> 0 < 32 ? $14 + 1 | 0 : $14;
       $7 = $9 & 31;
       if (($9 & 63) >>> 0 >= 32) {
        $16 = $5 << $7;
        $5 = 0;
       } else {
        $16 = (1 << $7) - 1 & $5 >>> 32 - $7;
        $5 = $5 << $7;
       }
       $5 = $5 + $11 | 0;
       $10 = $10 + $16 | 0;
       $10 = $5 >>> 0 < $11 >>> 0 ? $10 + 1 | 0 : $10;
       $11 = $5;
      }
      block31 : {
       block39 : {
        block34 : {
         block40 : {
          block30 : {
           block29 : {
            block28 : {
             block27 : {
              block26 : {
               block25 : {
                $17 = $8 >>> 4 | 0;
                $5 = $17 - 1 | 0;
                $18 = ($8 & 15) << 28 | $4 >>> 4;
                $7 = $18 - 28 | 0;
                $5 = $7 >>> 0 < 4294967268 ? $5 + 1 | 0 : $5;
                if (!(!$5 & $7 >>> 0 > 4 | ($5 | 0) != 0)) {
                 switch ($7 - 1 | 0) {
                 case 0:
                  break block26;
                 case 1:
                  break block27;
                 case 2:
                  break block28;
                 case 3:
                  break block29;
                 default:
                  break block25;
                 }
                }
                if (!$17 & $18 >>> 0 <= 27) {
                 break block30
                }
                HEAP32[$0 >> 2] = 9;
                $1 = $13 + 32 | 0;
                HEAP32[$1 >> 2] = 27;
                HEAP32[$1 + 4 >> 2] = 0;
                HEAP32[$13 + 24 >> 2] = $18;
                HEAP32[$13 + 28 >> 2] = $17;
                HEAP32[$13 + 16 >> 2] = $6;
                HEAP32[$13 + 20 >> 2] = $12;
                HEAP8[$0 + 16 | 0] = 0;
                break block1;
               }
               $7 = $2 + $6 | 0;
               while (1) {
                HEAP8[$7 | 0] = 0;
                $6 = $6 + 1 | 0;
                $12 = $6 ? $12 : $12 + 1 | 0;
                if (!$12 & $3 >>> 0 <= $6 >>> 0 | $12) {
                 break block31
                }
                $7 = $7 + 1 | 0;
                if ($6 & 15) {
                 continue
                }
                break;
               };
               break block31;
              }
              $4 = ($10 & 3) << 30 | $11 >>> 2;
              $8 = $10 >>> 2 | 0;
              $5 = $11 & 3;
              if (($14 | 0) < 0) {
               $11 = 1
              } else {
               $11 = ($14 | 0) <= 0 & $9 >>> 0 <= 1
              }
              block33 : {
               if (!$11) {
                $11 = $14 - 1 | 0;
                $9 = $9 - 2 | 0;
                $14 = $9 >>> 0 < 4294967294 ? $11 + 1 | 0 : $11;
                break block33;
               }
               $11 = HEAP32[$15 >> 2];
               $9 = $9 + 30 | 0;
               $14 = $9 >>> 0 < 30 ? $14 + 1 | 0 : $14;
               $10 = $9 & 31;
               if (($9 & 63) >>> 0 >= 32) {
                $16 = $11 << $10;
                $11 = 0;
               } else {
                $16 = (1 << $10) - 1 & $11 >>> 32 - $10;
                $11 = $11 << $10;
               }
               $11 = $11 + $4 | 0;
               $10 = $8 + $16 | 0;
               $8 = $4 >>> 0 > $11 >>> 0 ? $10 + 1 | 0 : $10;
               $4 = $11;
               $15 = $15 + 4 | 0;
              }
              if (($5 | 0) != 3) {
               break block34
              }
              $20 = 8;
              $7 = 0;
              while (1) {
               $11 = ($8 & 7) << 29 | $4 >>> 3;
               $10 = $8 >>> 3 | 0;
               if (($14 | 0) < 0) {
                $5 = 1
               } else {
                $5 = ($14 | 0) <= 0 & $9 >>> 0 <= 2
               }
               block36 : {
                if (!$5) {
                 $5 = $14 - 1 | 0;
                 $9 = $9 - 3 | 0;
                 $14 = $9 >>> 0 < 4294967293 ? $5 + 1 | 0 : $5;
                 break block36;
                }
                $5 = HEAP32[$15 >> 2];
                $9 = $9 + 29 | 0;
                $14 = $9 >>> 0 < 29 ? $14 + 1 | 0 : $14;
                $8 = $9 & 31;
                if (($9 & 63) >>> 0 >= 32) {
                 $16 = $5 << $8;
                 $5 = 0;
                } else {
                 $16 = (1 << $8) - 1 & $5 >>> 32 - $8;
                 $5 = $5 << $8;
                }
                $5 = $5 + $11 | 0;
                $10 = $10 + $16 | 0;
                $10 = $5 >>> 0 < $11 >>> 0 ? $10 + 1 | 0 : $10;
                $11 = $5;
                $15 = $15 + 4 | 0;
               }
               block38 : {
                $5 = $20;
                $17 = $4 & 7;
                $20 = $20 + $17 | 0;
                $7 = $5 >>> 0 > $20 >>> 0 ? $7 + 1 | 0 : $7;
                $5 = $12 + $7 | 0;
                $8 = $5 + 1 | 0;
                $4 = $5;
                $5 = $6 + $20 | 0;
                $16 = $5 >>> 0 < $6 >>> 0 ? $8 : $4;
                if (!(!$16 & $3 >>> 0 < $5 >>> 0 | ($16 | 0) != 0)) {
                 $21 = $12 ^ $16;
                 $18 = $6 ^ $5;
                 if (!$21 & $18 >>> 0 < 16) {
                  break block38
                 }
                }
                HEAP32[$0 >> 2] = 9;
                $1 = $13 + 104 | 0;
                HEAP32[$1 >> 2] = 16;
                HEAP32[$1 + 4 >> 2] = 0;
                $1 = $13 + 96 | 0;
                HEAP32[$1 >> 2] = $3;
                HEAP32[$1 + 4 >> 2] = 0;
                HEAP32[$13 + 88 >> 2] = $20;
                HEAP32[$13 + 92 >> 2] = $7;
                HEAP32[$13 + 80 >> 2] = $6;
                HEAP32[$13 + 84 >> 2] = $12;
                HEAP8[$0 + 16 | 0] = 0;
                break block1;
               }
               $4 = $11;
               $8 = $10;
               if (($17 | 0) == 7) {
                continue
               }
               break;
              };
              break block39;
             }
             HEAP8[$2 + $6 | 0] = $19;
             break block40;
            }
            if (!(!$12 & $6 >>> 0 >= 16 | ($12 | 0) != 0)) {
             HEAP32[$0 >> 2] = 9;
             HEAP32[$13 + 120 >> 2] = 16;
             HEAP32[$13 + 124 >> 2] = 0;
             HEAP32[$13 + 112 >> 2] = $6;
             HEAP32[$13 + 116 >> 2] = $12;
             HEAP8[$0 + 16 | 0] = 0;
             break block1;
            }
            $19 = HEAPU8[($6 - 16 | 0) + $2 | 0];
            HEAP8[$2 + $6 | 0] = $19;
            if (!$19) {
             HEAP32[$0 >> 2] = 9;
             HEAP32[$13 + 128 >> 2] = $6;
             HEAP32[$13 + 132 >> 2] = $12;
             HEAP8[$0 + 16 | 0] = 0;
             break block1;
            }
            $22 = 0;
            break block40;
           }
           if (!(!$12 & $6 >>> 0 >= 16 | ($12 | 0) != 0)) {
            HEAP32[$0 >> 2] = 9;
            HEAP32[$13 + 152 >> 2] = 16;
            HEAP32[$13 + 156 >> 2] = 0;
            HEAP32[$13 + 144 >> 2] = $6;
            HEAP32[$13 + 148 >> 2] = $12;
            HEAP8[$0 + 16 | 0] = 0;
            break block1;
           }
           $5 = $2 + $6 | 0;
           $4 = HEAPU8[($6 - 16 | 0) + $2 | 0] + 1 | 0;
           HEAP8[$5 | 0] = $4;
           $19 = $4 & 255;
           if (($19 | 0) == ($4 | 0)) {
            $22 = 0;
            if ($19 >>> 0 <= 27) {
             break block40
            }
           }
           HEAP32[$0 >> 2] = 9;
           HEAP32[$13 + 168 >> 2] = HEAPU8[$5 | 0];
           HEAP32[$13 + 160 >> 2] = $6;
           HEAP32[$13 + 164 >> 2] = $12;
           HEAP8[$0 + 16 | 0] = 0;
           break block1;
          }
          HEAP8[$2 + $6 | 0] = $18;
          $5 = !$8 & $4 >>> 0 < 16;
          $19 = $5 ? $19 : $18;
          $22 = $5 ? $22 : $17;
         }
         $6 = $6 + 1 | 0;
         $12 = $6 ? $12 : $12 + 1 | 0;
         break block31;
        }
        $20 = $5 + 5 | 0;
        $7 = $20 >>> 0 < 5;
        $11 = $12 + $7 | 0;
        $5 = $6 + $20 | 0;
        $16 = $5 >>> 0 < $6 >>> 0 ? $11 + 1 | 0 : $11;
        $18 = $6 ^ $5;
        $21 = $12 ^ $16;
        $11 = $4;
        $10 = $8;
       }
       if ($16 | !$16 & $3 >>> 0 < $5 >>> 0) {
        break block45
       }
       if ($21 | !$21 & $18 >>> 0 >= 16) {
        break block45
       }
       $5 = $7 - 1 | 0;
       $4 = $20 - 1 | 0;
       $8 = ($4 | 0) != -1 ? $5 + 1 | 0 : $5;
       $7 = $2 + $6 | 0;
       while (1) {
        HEAP8[$7 | 0] = 0;
        $6 = $6 + 1 | 0;
        $12 = $6 ? $12 : $12 + 1 | 0;
        if (!$12 & $3 >>> 0 <= $6 >>> 0 | $12) {
         break block31
        }
        $17 = ($4 | $8) != 0;
        $7 = $7 + 1 | 0;
        $5 = $8 - 1 | 0;
        $4 = $4 - 1 | 0;
        $8 = ($4 | 0) != -1 ? $5 + 1 | 0 : $5;
        if ($17) {
         continue
        }
        break;
       };
      }
      if (!$12 & $3 >>> 0 > $6 >>> 0) {
       continue
      }
      break;
     };
    }
    HEAP32[$1 + 16 >> 2] = $15;
    HEAP32[$1 + 8 >> 2] = $9;
    HEAP32[$1 + 12 >> 2] = $14;
    HEAP32[$1 >> 2] = $11;
    HEAP32[$1 + 4 >> 2] = $10;
    break block1;
   }
   HEAP32[$0 >> 2] = 9;
   $1 = $13 + 72 | 0;
   HEAP32[$1 >> 2] = 16;
   HEAP32[$1 + 4 >> 2] = 0;
   $1 = $13 - -64 | 0;
   HEAP32[$1 >> 2] = $3;
   HEAP32[$1 + 4 >> 2] = 0;
   HEAP32[$13 + 56 >> 2] = $20;
   HEAP32[$13 + 60 >> 2] = $7;
   HEAP32[$13 + 48 >> 2] = $6;
   HEAP32[$13 + 52 >> 2] = $12;
   HEAP8[$0 + 16 | 0] = 0;
  }
  __stack_pointer = $13 + 1120 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount0_Ptr3($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0;
  $14 = __stack_pointer - 208 | 0;
  __stack_pointer = $14;
  $5 = $1 - -64 | 0;
  $21 = HEAP32[$5 >> 2];
  $18 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $12 = HEAP32[$5 >> 2];
  $3 = $1 + 56 | 0;
  $24 = HEAP32[$3 >> 2];
  block2 : {
   block1 : {
    $13 = HEAP32[$5 + 4 >> 2];
    $5 = $13;
    $19 = HEAP32[$3 + 4 >> 2];
    $3 = $19;
    if (!(($5 | 0) == ($3 | 0) & $12 >>> 0 >= $24 >>> 0 | $3 >>> 0 < $5 >>> 0)) {
     if (($3 | 0) == ($18 | 0) & $21 >>> 0 >= $24 >>> 0 | $3 >>> 0 < $18 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $14 + 40 | 0;
    HEAP32[$1 >> 2] = $21;
    HEAP32[$1 + 4 >> 2] = $18;
    $1 = $14 + 32 | 0;
    HEAP32[$1 >> 2] = $24;
    HEAP32[$1 + 4 >> 2] = $19;
    $1 = $14 + 24 | 0;
    HEAP32[$1 >> 2] = $12;
    HEAP32[$1 + 4 >> 2] = $13;
    HEAP32[$14 + 12 >> 2] = 42;
    HEAP32[$14 + 16 >> 2] = 0;
    HEAP32[$14 + 8 >> 2] = 3772;
    HEAP32[$14 + 4 >> 2] = 4963;
    HEAP32[$14 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $5 = $1 + 144 | 0;
   $3 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   if ($3 | $5) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$14 + 192 >> 2] = 0;
    $1 = $14 + 184 | 0;
    HEAP32[$1 >> 2] = $3;
    HEAP32[$1 + 4 >> 2] = $5;
    HEAP32[$14 + 172 >> 2] = 50;
    HEAP32[$14 + 176 >> 2] = 0;
    HEAP32[$14 + 168 >> 2] = 3772;
    HEAP32[$14 + 164 >> 2] = 4963;
    HEAP32[$14 + 160 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $5 = $1 + 152 | 0;
   $3 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   if (!(!$5 & ($3 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$14 + 144 >> 2] = 3;
    $1 = $14 + 136 | 0;
    HEAP32[$1 >> 2] = $3;
    HEAP32[$1 + 4 >> 2] = $5;
    HEAP32[$14 + 124 >> 2] = 66;
    HEAP32[$14 + 128 >> 2] = 0;
    HEAP32[$14 + 120 >> 2] = 3772;
    HEAP32[$14 + 116 >> 2] = 4963;
    HEAP32[$14 + 112 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $28 = HEAP32[$1 + 176 >> 2];
   $29 = HEAP32[$1 + 172 >> 2];
   $20 = HEAP32[$1 + 264 >> 2];
   $3 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $8 = HEAP32[$5 >> 2];
   $9 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 184 | 0;
   $11 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   $2 = $1 + 248 | 0;
   $7 = HEAP32[$2 >> 2];
   $2 = HEAP32[$2 + 4 >> 2];
   $6 = $2;
   block37 : {
    block28 : {
     block7 : {
      block8 : {
       if ($2 | $7) {
        $4 = $1 + 256 | 0;
        $2 = HEAP32[$4 >> 2];
        $10 = 0 - $2 | 0;
        $15 = HEAP32[$4 + 4 >> 2];
        $4 = 0 - ($15 + (($2 | 0) != 0) | 0) | 0;
        if (!(($4 | 0) == ($13 | 0) & $10 >>> 0 <= $12 >>> 0 | $4 >>> 0 < $13 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $3 = HEAP32[$1 + 40 >> 2];
         $5 = HEAP32[$1 + 44 >> 2];
         $1 = $14 + 96 | 0;
         HEAP32[$1 >> 2] = $10;
         HEAP32[$1 + 4 >> 2] = $4;
         HEAP32[$14 + 88 >> 2] = $3;
         HEAP32[$14 + 92 >> 2] = $5;
         HEAP32[$14 + 80 >> 2] = $12;
         HEAP32[$14 + 84 >> 2] = $13;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $4 = $6 + $13 | 0;
        $10 = $7 + $12 | 0;
        $6 = $10 >>> 0 < $12 >>> 0 ? $4 + 1 | 0 : $4;
        if (($18 | 0) == ($6 | 0) & $10 >>> 0 > $21 >>> 0 | $6 >>> 0 > $18 >>> 0) {
         break block7
        }
        $4 = $12 + $20 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
         $4 = $4 + 1 | 0;
         $12 = $12 + 1 | 0;
         $13 = $12 ? $13 : $13 + 1 | 0;
         if (($6 | 0) == ($13 | 0) & $10 >>> 0 > $12 >>> 0 | $6 >>> 0 > $13 >>> 0) {
          continue
         }
         break;
        };
        if (($13 | 0) == ($19 | 0) & $12 >>> 0 >= $24 >>> 0 | $13 >>> 0 > $19 >>> 0) {
         break block8
        }
       }
       $30 = $20 + 2 | 0;
       while (1) {
        $22 = $12 + 3 | 0;
        $26 = $22 >>> 0 < 3 ? $13 + 1 | 0 : $13;
        $25 = $12 + $30 | 0;
        while (1) {
         $4 = HEAP16[(($11 & 4095) << 1) + $29 >> 1];
         $10 = $4;
         $6 = $4 >> 31;
         block10 : {
          if (($4 | 0) >= 0) {
           $2 = $3;
           break block10;
          }
          $6 = $10 & 15;
          $2 = $6;
          $7 = $5 >>> $2 | 0;
          $11 = ((1 << $2) - 1 & $5) << 32 - $2 | $11 >>> $2;
          $5 = $7;
          $2 = $8;
          $8 = $2 - $6 | 0;
          $9 = $9 - ($2 >>> 0 < $6 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block12 : {
           if (!$2) {
            $2 = $3;
            break block12;
           }
           $2 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $6 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $6;
            $3 = 0;
           } else {
            $7 = (1 << $6) - 1 & $3 >>> 32 - $6;
            $3 = $3 << $6;
           }
           $3 = $3 + $11 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
           $11 = $3;
          }
          $3 = (($4 & 2147483632) << 1) + $29 | 0;
          $4 = HEAP16[$3 + (($11 & 63) << 1) >> 1];
          $10 = $4;
          $6 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block10
          }
          while (1) {
           $6 = $10 & 15;
           $7 = $5 >>> $6 | 0;
           $11 = ((1 << $6) - 1 & $5) << 32 - $6 | $11 >>> $6;
           $5 = $7;
           $7 = $8;
           $8 = $8 - $6 | 0;
           $9 = $9 - ($6 >>> 0 > $7 >>> 0) | 0;
           if (($9 | 0) < 0) {
            $6 = HEAP32[$2 >> 2];
            $8 = $8 + 32 | 0;
            $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $15 = $8 & 31;
            if (($8 & 63) >>> 0 >= 32) {
             $7 = $6 << $15;
             $10 = 0;
            } else {
             $7 = (1 << $15) - 1 & $6 >>> 32 - $15;
             $10 = $6 << $15;
            }
            $6 = $10 + $11 | 0;
            $5 = $5 + $7 | 0;
            $5 = $6 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
            $2 = $2 + 4 | 0;
            $11 = $6;
           }
           $3 = (($4 & 65520) << 16 >> 16 << 1) + $3 | 0;
           $4 = HEAP16[$3 + (($11 & 63) << 1) >> 1];
           $10 = $4;
           $6 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $4 = $10 & 15;
         $3 = $4;
         $7 = $5 >>> $3 | 0;
         $11 = ((1 << $3) - 1 & $5) << 32 - $3 | $11 >>> $3;
         $5 = $7;
         $3 = $8;
         $8 = $3 - $4 | 0;
         $9 = $9 - ($3 >>> 0 < $4 >>> 0) | 0;
         if (($9 | 0) < -1) {
          $3 = 1
         } else {
          $3 = ($9 | 0) < 0
         }
         block15 : {
          if (!$3) {
           $3 = $2;
           break block15;
          }
          $3 = $2 + 4 | 0;
          $2 = HEAP32[$2 >> 2];
          $8 = $8 + 32 | 0;
          $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
          $4 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $7 = $2 << $4;
           $2 = 0;
          } else {
           $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
           $2 = $2 << $4;
          }
          $2 = $2 + $11 | 0;
          $5 = $5 + $7 | 0;
          $5 = $2 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
          $11 = $2;
         }
         $27 = ($6 & 15) << 28 | $10 >>> 4;
         $23 = $6 >>> 4 | 0;
         if (!(!$6 & $10 >>> 0 > 4095 | ($6 | 0) != 0)) {
          HEAP8[$12 + $20 | 0] = $27;
          $25 = $25 + 1 | 0;
          $22 = $22 + 1 | 0;
          $26 = $22 ? $26 : $26 + 1 | 0;
          $12 = $12 + 1 | 0;
          $13 = $12 ? $13 : $13 + 1 | 0;
          if (($19 | 0) == ($13 | 0) & $12 >>> 0 < $24 >>> 0 | $13 >>> 0 < $19 >>> 0) {
           continue
          }
          break block8;
         }
         break;
        };
        $16 = 0;
        $17 = $27 & 15;
        block18 : {
         if (($17 | 0) != 15) {
          $4 = $3;
          break block18;
         }
         $4 = HEAP16[(($11 & 4095) << 1) + $28 >> 1];
         $10 = $4;
         $6 = $4 >> 31;
         block20 : {
          if (($4 | 0) >= 0) {
           $2 = $3;
           break block20;
          }
          $6 = $10 & 15;
          $2 = $6;
          $7 = $5 >>> $2 | 0;
          $11 = ((1 << $2) - 1 & $5) << 32 - $2 | $11 >>> $2;
          $5 = $7;
          $2 = $8;
          $8 = $2 - $6 | 0;
          $9 = $9 - ($2 >>> 0 < $6 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $3;
            break block22;
           }
           $2 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $6 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $6;
            $3 = 0;
           } else {
            $7 = (1 << $6) - 1 & $3 >>> 32 - $6;
            $3 = $3 << $6;
           }
           $3 = $3 + $11 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
           $11 = $3;
          }
          $3 = (($4 & 2147483632) << 1) + $28 | 0;
          $4 = HEAP16[$3 + (($11 & 63) << 1) >> 1];
          $10 = $4;
          $6 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $6 = $10 & 15;
           $7 = $5 >>> $6 | 0;
           $11 = ((1 << $6) - 1 & $5) << 32 - $6 | $11 >>> $6;
           $5 = $7;
           $7 = $8;
           $8 = $8 - $6 | 0;
           $9 = $9 - ($6 >>> 0 > $7 >>> 0) | 0;
           if (($9 | 0) < 0) {
            $6 = HEAP32[$2 >> 2];
            $8 = $8 + 32 | 0;
            $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $15 = $8 & 31;
            if (($8 & 63) >>> 0 >= 32) {
             $7 = $6 << $15;
             $10 = 0;
            } else {
             $7 = (1 << $15) - 1 & $6 >>> 32 - $15;
             $10 = $6 << $15;
            }
            $6 = $10 + $11 | 0;
            $5 = $5 + $7 | 0;
            $5 = $6 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
            $2 = $2 + 4 | 0;
            $11 = $6;
           }
           $3 = (($4 & 65520) << 16 >> 16 << 1) + $3 | 0;
           $4 = HEAP16[$3 + (($11 & 63) << 1) >> 1];
           $10 = $4;
           $6 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $4 = $10 & 15;
         $7 = $5 >>> $4 | 0;
         $11 = ((1 << $4) - 1 & $5) << 32 - $4 | $11 >>> $4;
         $5 = $7;
         $3 = $8;
         $8 = $3 - $4 | 0;
         $9 = $9 - ($3 >>> 0 < $4 >>> 0) | 0;
         if (($9 | 0) < -1) {
          $3 = 1
         } else {
          $3 = ($9 | 0) < 0
         }
         block25 : {
          if (!$3) {
           $3 = $2;
           break block25;
          }
          $3 = $2 + 4 | 0;
          $2 = HEAP32[$2 >> 2];
          $8 = $8 + 32 | 0;
          $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
          $4 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $7 = $2 << $4;
           $2 = 0;
          } else {
           $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
           $2 = $2 << $4;
          }
          $2 = $2 + $11 | 0;
          $5 = $5 + $7 | 0;
          $5 = $2 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
          $11 = $2;
         }
         $17 = ($6 & 15) << 28 | $10 >>> 4;
         $16 = $6 >>> 4 | 0;
         block27 : {
          if (!(!$6 & $10 >>> 0 >= 3712 | ($6 | 0) != 0)) {
           $4 = $3;
           break block27;
          }
          $2 = $16 - 1 | 0;
          $16 = $17 - 232 | 0;
          $4 = $16 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
          if (!$4 & $16 >>> 0 >= 33 | $4) {
           break block28
          }
          $10 = $16 << 3;
          $2 = $10 + 6656 | 0;
          $15 = $11 & HEAP32[$2 >> 2];
          $6 = $5 & HEAP32[$2 + 4 >> 2];
          $2 = $16 & 31;
          if (($16 & 63) >>> 0 >= 32) {
           $7 = 0;
           $11 = $5 >>> $2 | 0;
          } else {
           $7 = $5 >>> $2 | 0;
           $11 = ((1 << $2) - 1 & $5) << 32 - $2 | $11 >>> $2;
          }
          $5 = $7;
          $2 = $8;
          $8 = $2 - $16 | 0;
          $9 = $9 - (($2 >>> 0 < $16 >>> 0) + $4 | 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $4 = $3;
            break block30;
           }
           $4 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $2;
            $3 = 0;
           } else {
            $7 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $3 = $3 << $2;
           }
           $3 = $3 + $11 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
           $11 = $3;
          }
          $3 = $10 + 6400 | 0;
          $2 = HEAP32[$3 >> 2];
          $7 = $2 + $15 | 0;
          $3 = HEAP32[$3 + 4 >> 2] + $6 | 0;
          $3 = $2 >>> 0 > $7 >>> 0 ? $3 + 1 | 0 : $3;
          $17 = $7 + 231 | 0;
          $16 = $17 >>> 0 < 231 ? $3 + 1 | 0 : $3;
         }
         $17 = $17 + 15 | 0;
         $16 = $17 >>> 0 < 15 ? $16 + 1 | 0 : $16;
        }
        $3 = $23 - 1 | 0;
        $7 = $3 + 1 | 0;
        $2 = $3;
        $3 = $27 - 256 | 0;
        $2 = $3 >>> 0 < 4294967040 ? $7 : $2;
        if (!$2 & $3 >>> 0 >= 528 | $2) {
         break block28
        }
        $23 = ($2 & 15) << 28 | $3 >>> 4;
        $15 = $23 << 3;
        $3 = $15 + 6656 | 0;
        $10 = $11 & HEAP32[$3 >> 2];
        $6 = $5 & HEAP32[$3 + 4 >> 2];
        $2 = $2 >>> 4 | 0;
        $3 = $23 & 31;
        if (($23 & 63) >>> 0 >= 32) {
         $7 = 0;
         $11 = $5 >>> $3 | 0;
        } else {
         $7 = $5 >>> $3 | 0;
         $11 = ((1 << $3) - 1 & $5) << 32 - $3 | $11 >>> $3;
        }
        $5 = $7;
        $3 = $8;
        $8 = $3 - $23 | 0;
        $9 = $9 - (($3 >>> 0 < $23 >>> 0) + $2 | 0) | 0;
        if (($9 | 0) < -1) {
         $3 = 1
        } else {
         $3 = ($9 | 0) < 0
        }
        block32 : {
         if (!$3) {
          $3 = $4;
          break block32;
         }
         $3 = $4 + 4 | 0;
         $2 = HEAP32[$4 >> 2];
         $8 = $8 + 32 | 0;
         $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
         $4 = $8 & 31;
         if (($8 & 63) >>> 0 >= 32) {
          $7 = $2 << $4;
          $2 = 0;
         } else {
          $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
          $2 = $2 << $4;
         }
         $2 = $2 + $11 | 0;
         $5 = $5 + $7 | 0;
         $5 = $2 >>> 0 < $11 >>> 0 ? $5 + 1 | 0 : $5;
         $11 = $2;
        }
        $2 = $15 + 6400 | 0;
        $7 = HEAP32[$2 >> 2];
        $2 = $6 + HEAP32[$2 + 4 >> 2] | 0;
        $4 = $7 + $10 | 0;
        $7 = $4 >>> 0 < $10 >>> 0 ? $2 + 1 | 0 : $2;
        if (!(($13 | 0) == ($7 | 0) & $4 >>> 0 <= $12 >>> 0 | $7 >>> 0 < $13 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $3 = HEAP32[$1 + 40 >> 2];
         $5 = HEAP32[$1 + 44 >> 2];
         $1 = $14 - -64 | 0;
         HEAP32[$1 >> 2] = $4;
         HEAP32[$1 + 4 >> 2] = $7;
         HEAP32[$14 + 56 >> 2] = $3;
         HEAP32[$14 + 60 >> 2] = $5;
         HEAP32[$14 + 48 >> 2] = $12;
         HEAP32[$14 + 52 >> 2] = $13;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $2 = 0 - $4 | 0;
        $15 = 0 - ((($4 | 0) != 0) + $7 | 0) | 0;
        $7 = $13 + $16 | 0;
        $4 = $12 + $17 | 0;
        $7 = $4 >>> 0 < $17 >>> 0 ? $7 + 1 | 0 : $7;
        $10 = $4 + 3 | 0;
        $6 = $10 >>> 0 < 3 ? $7 + 1 | 0 : $7;
        if (($18 | 0) == ($6 | 0) & $10 >>> 0 > $21 >>> 0 | $6 >>> 0 > $18 >>> 0) {
         break block7
        }
        $7 = $2;
        $4 = $2 + $20 | 0;
        HEAP8[$12 + $20 | 0] = HEAPU8[$4 + $12 | 0];
        $2 = $12 + 1 | 0;
        HEAP8[$2 + $20 | 0] = HEAPU8[$2 + $4 | 0];
        $2 = $12 + 2 | 0;
        $15 = $2 >>> 0 < 2 ? $13 + 1 | 0 : $13;
        block35 : {
         if (!(($6 | 0) == ($15 | 0) & $2 >>> 0 < $10 >>> 0 | $6 >>> 0 > $15 >>> 0)) {
          $12 = $2;
          $13 = $15;
          break block35;
         }
         $4 = $17 + 1 & 3;
         if ($4) {
          $10 = 0;
          $6 = 0;
          $15 = 0 - $4 | 0;
          $4 = 0 - (($4 | 0) != 0) | 0;
          while (1) {
           HEAP8[$25 | 0] = HEAPU8[$7 + $25 | 0];
           $25 = $25 + 1 | 0;
           $2 = $6 - 1 | 0;
           $10 = $10 - 1 | 0;
           $6 = ($10 | 0) != -1 ? $2 + 1 | 0 : $2;
           if (($10 | 0) != ($15 | 0) | ($4 | 0) != ($6 | 0)) {
            continue
           }
           break;
          };
          $2 = $13 - (($10 >>> 0 > $12 >>> 0) + $6 | 0) | 0;
          $6 = $2 + 1 | 0;
          $4 = $2;
          $2 = ($12 - $10 | 0) + 2 | 0;
          $15 = $2 >>> 0 < 2 ? $6 : $4;
         }
         $4 = $16 + $26 | 0;
         $12 = $17 + $22 | 0;
         $13 = $12 >>> 0 < $22 >>> 0 ? $4 + 1 | 0 : $4;
         if (!$16 & $17 >>> 0 < 3) {
          break block35
         }
         $10 = $2 - $17 | 0;
         $6 = $15 - (($2 >>> 0 < $17 >>> 0) + $16 | 0) | 0;
         $4 = $2 + $20 | 0;
         while (1) {
          $2 = $4 + $7 | 0;
          HEAP8[$4 | 0] = HEAPU8[$2 | 0];
          HEAP8[$4 + 1 | 0] = HEAPU8[$2 + 1 | 0];
          HEAP8[$4 + 2 | 0] = HEAPU8[$2 + 2 | 0];
          HEAP8[$4 + 3 | 0] = HEAPU8[$2 + 3 | 0];
          $4 = $4 + 4 | 0;
          $10 = $10 + 4 | 0;
          $6 = $10 >>> 0 < 4 ? $6 + 1 | 0 : $6;
          if (($10 | 0) != ($22 | 0) | ($6 | 0) != ($26 | 0)) {
           continue
          }
          break;
         };
        }
        if (($13 | 0) == ($19 | 0) & $12 >>> 0 < $24 >>> 0 | $13 >>> 0 < $19 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block37;
     }
     $4 = $12 + $20 | 0;
     while (1) {
      HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
      $4 = $4 + 1 | 0;
      $12 = $12 + 1 | 0;
      $13 = $12 ? $13 : $13 + 1 | 0;
      if (($18 | 0) == ($13 | 0) & $12 >>> 0 < $21 >>> 0 | $13 >>> 0 < $18 >>> 0) {
       continue
      }
      break;
     };
     $0 = $1 + 256 | 0;
     HEAP32[$0 >> 2] = $2;
     HEAP32[$0 + 4 >> 2] = $15;
     HEAP32[$1 + 248 >> 2] = $10 - $21;
     HEAP32[$1 + 252 >> 2] = $6 - (($10 >>> 0 < $21 >>> 0) + $18 | 0);
     break block37;
    }
    wasm2js_trap();
   }
   HEAP32[$1 + 200 >> 2] = $3;
   HEAP32[$1 + 192 >> 2] = $8;
   HEAP32[$1 + 196 >> 2] = $9;
   HEAP32[$1 + 184 >> 2] = $11;
   HEAP32[$1 + 188 >> 2] = $5;
   HEAP32[$1 + 48 >> 2] = $12;
   HEAP32[$1 + 52 >> 2] = $13;
  }
  __stack_pointer = $14 + 208 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount0_Ptr4($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0;
  $14 = __stack_pointer - 208 | 0;
  __stack_pointer = $14;
  $5 = $1 - -64 | 0;
  $23 = HEAP32[$5 >> 2];
  $18 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $12 = HEAP32[$5 >> 2];
  $3 = $1 + 56 | 0;
  $25 = HEAP32[$3 >> 2];
  block2 : {
   block1 : {
    $13 = HEAP32[$5 + 4 >> 2];
    $5 = $13;
    $21 = HEAP32[$3 + 4 >> 2];
    $3 = $21;
    if (!(($5 | 0) == ($3 | 0) & $12 >>> 0 >= $25 >>> 0 | $3 >>> 0 < $5 >>> 0)) {
     if (($3 | 0) == ($18 | 0) & $23 >>> 0 >= $25 >>> 0 | $3 >>> 0 < $18 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $14 + 40 | 0;
    HEAP32[$1 >> 2] = $23;
    HEAP32[$1 + 4 >> 2] = $18;
    $1 = $14 + 32 | 0;
    HEAP32[$1 >> 2] = $25;
    HEAP32[$1 + 4 >> 2] = $21;
    $1 = $14 + 24 | 0;
    HEAP32[$1 >> 2] = $12;
    HEAP32[$1 + 4 >> 2] = $13;
    HEAP32[$14 + 12 >> 2] = 42;
    HEAP32[$14 + 16 >> 2] = 0;
    HEAP32[$14 + 8 >> 2] = 3772;
    HEAP32[$14 + 4 >> 2] = 4839;
    HEAP32[$14 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $5 = $1 + 144 | 0;
   $3 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   if ($3 | $5) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$14 + 192 >> 2] = 0;
    $1 = $14 + 184 | 0;
    HEAP32[$1 >> 2] = $3;
    HEAP32[$1 + 4 >> 2] = $5;
    HEAP32[$14 + 172 >> 2] = 50;
    HEAP32[$14 + 176 >> 2] = 0;
    HEAP32[$14 + 168 >> 2] = 3772;
    HEAP32[$14 + 164 >> 2] = 4839;
    HEAP32[$14 + 160 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $5 = $1 + 152 | 0;
   $3 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   if (!(!$5 & ($3 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$14 + 144 >> 2] = 4;
    $1 = $14 + 136 | 0;
    HEAP32[$1 >> 2] = $3;
    HEAP32[$1 + 4 >> 2] = $5;
    HEAP32[$14 + 124 >> 2] = 66;
    HEAP32[$14 + 128 >> 2] = 0;
    HEAP32[$14 + 120 >> 2] = 3772;
    HEAP32[$14 + 116 >> 2] = 4839;
    HEAP32[$14 + 112 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $29 = HEAP32[$1 + 176 >> 2];
   $30 = HEAP32[$1 + 172 >> 2];
   $22 = HEAP32[$1 + 264 >> 2];
   $3 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $8 = HEAP32[$5 >> 2];
   $9 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 184 | 0;
   $10 = HEAP32[$5 >> 2];
   $5 = HEAP32[$5 + 4 >> 2];
   $2 = $1 + 248 | 0;
   $7 = HEAP32[$2 >> 2];
   $2 = HEAP32[$2 + 4 >> 2];
   $6 = $2;
   block37 : {
    block28 : {
     block7 : {
      block8 : {
       if ($2 | $7) {
        $4 = $1 + 256 | 0;
        $2 = HEAP32[$4 >> 2];
        $19 = 0 - $2 | 0;
        $15 = HEAP32[$4 + 4 >> 2];
        $4 = 0 - ($15 + (($2 | 0) != 0) | 0) | 0;
        if (!(($4 | 0) == ($13 | 0) & $12 >>> 0 >= $19 >>> 0 | $4 >>> 0 < $13 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $3 = HEAP32[$1 + 40 >> 2];
         $5 = HEAP32[$1 + 44 >> 2];
         $1 = $14 + 96 | 0;
         HEAP32[$1 >> 2] = $19;
         HEAP32[$1 + 4 >> 2] = $4;
         HEAP32[$14 + 88 >> 2] = $3;
         HEAP32[$14 + 92 >> 2] = $5;
         HEAP32[$14 + 80 >> 2] = $12;
         HEAP32[$14 + 84 >> 2] = $13;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $4 = $6 + $13 | 0;
        $11 = $7 + $12 | 0;
        $6 = $11 >>> 0 < $12 >>> 0 ? $4 + 1 | 0 : $4;
        if (($18 | 0) == ($6 | 0) & $11 >>> 0 > $23 >>> 0 | $6 >>> 0 > $18 >>> 0) {
         break block7
        }
        $4 = $12 + $22 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
         $4 = $4 + 1 | 0;
         $12 = $12 + 1 | 0;
         $13 = $12 ? $13 : $13 + 1 | 0;
         if (($6 | 0) == ($13 | 0) & $11 >>> 0 > $12 >>> 0 | $6 >>> 0 > $13 >>> 0) {
          continue
         }
         break;
        };
        if (($13 | 0) == ($21 | 0) & $12 >>> 0 >= $25 >>> 0 | $13 >>> 0 > $21 >>> 0) {
         break block8
        }
       }
       $31 = $22 + 2 | 0;
       while (1) {
        $24 = $12 + 4 | 0;
        $27 = $24 >>> 0 < 4 ? $13 + 1 | 0 : $13;
        $26 = $12 + $31 | 0;
        while (1) {
         $4 = HEAP16[(($10 & 4095) << 1) + $30 >> 1];
         $11 = $4;
         $6 = $4 >> 31;
         block10 : {
          if (($4 | 0) >= 0) {
           $2 = $3;
           break block10;
          }
          $6 = $11 & 15;
          $2 = $6;
          $7 = $5 >>> $2 | 0;
          $10 = ((1 << $2) - 1 & $5) << 32 - $2 | $10 >>> $2;
          $5 = $7;
          $2 = $8;
          $8 = $2 - $6 | 0;
          $9 = $9 - ($2 >>> 0 < $6 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block12 : {
           if (!$2) {
            $2 = $3;
            break block12;
           }
           $2 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $6 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $6;
            $3 = 0;
           } else {
            $7 = (1 << $6) - 1 & $3 >>> 32 - $6;
            $3 = $3 << $6;
           }
           $3 = $3 + $10 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
           $10 = $3;
          }
          $3 = (($4 & 2147483632) << 1) + $30 | 0;
          $4 = HEAP16[$3 + (($10 & 63) << 1) >> 1];
          $11 = $4;
          $6 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block10
          }
          while (1) {
           $6 = $11 & 15;
           $7 = $5 >>> $6 | 0;
           $10 = ((1 << $6) - 1 & $5) << 32 - $6 | $10 >>> $6;
           $5 = $7;
           $7 = $8;
           $8 = $8 - $6 | 0;
           $9 = $9 - ($6 >>> 0 > $7 >>> 0) | 0;
           if (($9 | 0) < 0) {
            $6 = HEAP32[$2 >> 2];
            $8 = $8 + 32 | 0;
            $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $15 = $8 & 31;
            if (($8 & 63) >>> 0 >= 32) {
             $7 = $6 << $15;
             $11 = 0;
            } else {
             $7 = (1 << $15) - 1 & $6 >>> 32 - $15;
             $11 = $6 << $15;
            }
            $6 = $11 + $10 | 0;
            $5 = $5 + $7 | 0;
            $5 = $6 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
            $2 = $2 + 4 | 0;
            $10 = $6;
           }
           $3 = (($4 & 65520) << 16 >> 16 << 1) + $3 | 0;
           $4 = HEAP16[$3 + (($10 & 63) << 1) >> 1];
           $11 = $4;
           $6 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $4 = $11 & 15;
         $3 = $4;
         $7 = $5 >>> $3 | 0;
         $10 = ((1 << $3) - 1 & $5) << 32 - $3 | $10 >>> $3;
         $5 = $7;
         $3 = $8;
         $8 = $3 - $4 | 0;
         $9 = $9 - ($3 >>> 0 < $4 >>> 0) | 0;
         if (($9 | 0) < -1) {
          $3 = 1
         } else {
          $3 = ($9 | 0) < 0
         }
         block15 : {
          if (!$3) {
           $3 = $2;
           break block15;
          }
          $3 = $2 + 4 | 0;
          $2 = HEAP32[$2 >> 2];
          $8 = $8 + 32 | 0;
          $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
          $4 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $7 = $2 << $4;
           $2 = 0;
          } else {
           $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
           $2 = $2 << $4;
          }
          $2 = $2 + $10 | 0;
          $5 = $5 + $7 | 0;
          $5 = $2 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
          $10 = $2;
         }
         $28 = ($6 & 15) << 28 | $11 >>> 4;
         $20 = $6 >>> 4 | 0;
         if (!(!$6 & $11 >>> 0 > 4095 | ($6 | 0) != 0)) {
          HEAP8[$12 + $22 | 0] = $28;
          $26 = $26 + 1 | 0;
          $24 = $24 + 1 | 0;
          $27 = $24 ? $27 : $27 + 1 | 0;
          $12 = $12 + 1 | 0;
          $13 = $12 ? $13 : $13 + 1 | 0;
          if (($21 | 0) == ($13 | 0) & $12 >>> 0 < $25 >>> 0 | $13 >>> 0 < $21 >>> 0) {
           continue
          }
          break block8;
         }
         break;
        };
        $16 = 0;
        $17 = $28 & 15;
        block18 : {
         if (($17 | 0) != 15) {
          $4 = $3;
          break block18;
         }
         $4 = HEAP16[(($10 & 4095) << 1) + $29 >> 1];
         $11 = $4;
         $6 = $4 >> 31;
         block20 : {
          if (($4 | 0) >= 0) {
           $2 = $3;
           break block20;
          }
          $6 = $11 & 15;
          $2 = $6;
          $7 = $5 >>> $2 | 0;
          $10 = ((1 << $2) - 1 & $5) << 32 - $2 | $10 >>> $2;
          $5 = $7;
          $2 = $8;
          $8 = $2 - $6 | 0;
          $9 = $9 - ($2 >>> 0 < $6 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $3;
            break block22;
           }
           $2 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $6 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $6;
            $3 = 0;
           } else {
            $7 = (1 << $6) - 1 & $3 >>> 32 - $6;
            $3 = $3 << $6;
           }
           $3 = $3 + $10 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
           $10 = $3;
          }
          $3 = (($4 & 2147483632) << 1) + $29 | 0;
          $4 = HEAP16[$3 + (($10 & 63) << 1) >> 1];
          $11 = $4;
          $6 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $6 = $11 & 15;
           $7 = $5 >>> $6 | 0;
           $10 = ((1 << $6) - 1 & $5) << 32 - $6 | $10 >>> $6;
           $5 = $7;
           $7 = $8;
           $8 = $8 - $6 | 0;
           $9 = $9 - ($6 >>> 0 > $7 >>> 0) | 0;
           if (($9 | 0) < 0) {
            $6 = HEAP32[$2 >> 2];
            $8 = $8 + 32 | 0;
            $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $15 = $8 & 31;
            if (($8 & 63) >>> 0 >= 32) {
             $7 = $6 << $15;
             $11 = 0;
            } else {
             $7 = (1 << $15) - 1 & $6 >>> 32 - $15;
             $11 = $6 << $15;
            }
            $6 = $11 + $10 | 0;
            $5 = $5 + $7 | 0;
            $5 = $6 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
            $2 = $2 + 4 | 0;
            $10 = $6;
           }
           $3 = (($4 & 65520) << 16 >> 16 << 1) + $3 | 0;
           $4 = HEAP16[$3 + (($10 & 63) << 1) >> 1];
           $11 = $4;
           $6 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $4 = $11 & 15;
         $7 = $5 >>> $4 | 0;
         $10 = ((1 << $4) - 1 & $5) << 32 - $4 | $10 >>> $4;
         $5 = $7;
         $3 = $8;
         $8 = $3 - $4 | 0;
         $9 = $9 - ($3 >>> 0 < $4 >>> 0) | 0;
         if (($9 | 0) < -1) {
          $3 = 1
         } else {
          $3 = ($9 | 0) < 0
         }
         block25 : {
          if (!$3) {
           $3 = $2;
           break block25;
          }
          $3 = $2 + 4 | 0;
          $2 = HEAP32[$2 >> 2];
          $8 = $8 + 32 | 0;
          $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
          $4 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $7 = $2 << $4;
           $2 = 0;
          } else {
           $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
           $2 = $2 << $4;
          }
          $2 = $2 + $10 | 0;
          $5 = $5 + $7 | 0;
          $5 = $2 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
          $10 = $2;
         }
         $17 = ($6 & 15) << 28 | $11 >>> 4;
         $16 = $6 >>> 4 | 0;
         block27 : {
          if (!(!$6 & $11 >>> 0 >= 3712 | ($6 | 0) != 0)) {
           $4 = $3;
           break block27;
          }
          $2 = $16 - 1 | 0;
          $16 = $17 - 232 | 0;
          $4 = $16 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
          if (!$4 & $16 >>> 0 >= 33 | $4) {
           break block28
          }
          $19 = $16 << 3;
          $2 = $19 + 6656 | 0;
          $15 = $10 & HEAP32[$2 >> 2];
          $6 = $5 & HEAP32[$2 + 4 >> 2];
          $2 = $16 & 31;
          if (($16 & 63) >>> 0 >= 32) {
           $7 = 0;
           $10 = $5 >>> $2 | 0;
          } else {
           $7 = $5 >>> $2 | 0;
           $10 = ((1 << $2) - 1 & $5) << 32 - $2 | $10 >>> $2;
          }
          $5 = $7;
          $2 = $8;
          $8 = $2 - $16 | 0;
          $9 = $9 - (($2 >>> 0 < $16 >>> 0) + $4 | 0) | 0;
          if (($9 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($9 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $4 = $3;
            break block30;
           }
           $4 = $3 + 4 | 0;
           $3 = HEAP32[$3 >> 2];
           $8 = $8 + 32 | 0;
           $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $8 & 31;
           if (($8 & 63) >>> 0 >= 32) {
            $7 = $3 << $2;
            $3 = 0;
           } else {
            $7 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $3 = $3 << $2;
           }
           $3 = $3 + $10 | 0;
           $5 = $5 + $7 | 0;
           $5 = $3 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
           $10 = $3;
          }
          $3 = $19 + 6400 | 0;
          $2 = HEAP32[$3 >> 2];
          $7 = $2 + $15 | 0;
          $3 = HEAP32[$3 + 4 >> 2] + $6 | 0;
          $3 = $2 >>> 0 > $7 >>> 0 ? $3 + 1 | 0 : $3;
          $17 = $7 + 231 | 0;
          $16 = $17 >>> 0 < 231 ? $3 + 1 | 0 : $3;
         }
         $17 = $17 + 15 | 0;
         $16 = $17 >>> 0 < 15 ? $16 + 1 | 0 : $16;
        }
        $3 = $20 - 1 | 0;
        $7 = $3 + 1 | 0;
        $2 = $3;
        $3 = $28 - 256 | 0;
        $2 = $3 >>> 0 < 4294967040 ? $7 : $2;
        if (!$2 & $3 >>> 0 >= 528 | $2) {
         break block28
        }
        $20 = ($2 & 15) << 28 | $3 >>> 4;
        $15 = $20 << 3;
        $3 = $15 + 6656 | 0;
        $19 = $10 & HEAP32[$3 >> 2];
        $6 = $5 & HEAP32[$3 + 4 >> 2];
        $2 = $2 >>> 4 | 0;
        $3 = $20 & 31;
        if (($20 & 63) >>> 0 >= 32) {
         $7 = 0;
         $10 = $5 >>> $3 | 0;
        } else {
         $7 = $5 >>> $3 | 0;
         $10 = ((1 << $3) - 1 & $5) << 32 - $3 | $10 >>> $3;
        }
        $5 = $7;
        $3 = $8;
        $8 = $3 - $20 | 0;
        $9 = $9 - (($3 >>> 0 < $20 >>> 0) + $2 | 0) | 0;
        if (($9 | 0) < -1) {
         $3 = 1
        } else {
         $3 = ($9 | 0) < 0
        }
        block32 : {
         if (!$3) {
          $3 = $4;
          break block32;
         }
         $3 = $4 + 4 | 0;
         $2 = HEAP32[$4 >> 2];
         $8 = $8 + 32 | 0;
         $9 = $8 >>> 0 < 32 ? $9 + 1 | 0 : $9;
         $4 = $8 & 31;
         if (($8 & 63) >>> 0 >= 32) {
          $7 = $2 << $4;
          $2 = 0;
         } else {
          $7 = (1 << $4) - 1 & $2 >>> 32 - $4;
          $2 = $2 << $4;
         }
         $2 = $2 + $10 | 0;
         $5 = $5 + $7 | 0;
         $5 = $2 >>> 0 < $10 >>> 0 ? $5 + 1 | 0 : $5;
         $10 = $2;
        }
        $2 = $15 + 6400 | 0;
        $7 = HEAP32[$2 >> 2];
        $2 = $6 + HEAP32[$2 + 4 >> 2] | 0;
        $4 = $7 + $19 | 0;
        $7 = $4 >>> 0 < $19 >>> 0 ? $2 + 1 | 0 : $2;
        if (!(($13 | 0) == ($7 | 0) & $4 >>> 0 <= $12 >>> 0 | $7 >>> 0 < $13 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $3 = HEAP32[$1 + 40 >> 2];
         $5 = HEAP32[$1 + 44 >> 2];
         $1 = $14 - -64 | 0;
         HEAP32[$1 >> 2] = $4;
         HEAP32[$1 + 4 >> 2] = $7;
         HEAP32[$14 + 56 >> 2] = $3;
         HEAP32[$14 + 60 >> 2] = $5;
         HEAP32[$14 + 48 >> 2] = $12;
         HEAP32[$14 + 52 >> 2] = $13;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $2 = 0 - $4 | 0;
        $15 = 0 - ((($4 | 0) != 0) + $7 | 0) | 0;
        $7 = $13 + $16 | 0;
        $4 = $12 + $17 | 0;
        $7 = $4 >>> 0 < $17 >>> 0 ? $7 + 1 | 0 : $7;
        $11 = $4 + 4 | 0;
        $6 = $11 >>> 0 < 4 ? $7 + 1 | 0 : $7;
        if (($18 | 0) == ($6 | 0) & $11 >>> 0 > $23 >>> 0 | $6 >>> 0 > $18 >>> 0) {
         break block7
        }
        $7 = $2;
        $4 = $2 + $22 | 0;
        HEAP8[$12 + $22 | 0] = HEAPU8[$4 + $12 | 0];
        $2 = $12 + 1 | 0;
        HEAP8[$2 + $22 | 0] = HEAPU8[$2 + $4 | 0];
        $2 = $12 + 2 | 0;
        $15 = $2 >>> 0 < 2 ? $13 + 1 | 0 : $13;
        block35 : {
         if (!(($6 | 0) == ($15 | 0) & $2 >>> 0 < $11 >>> 0 | $6 >>> 0 > $15 >>> 0)) {
          $12 = $2;
          $13 = $15;
          break block35;
         }
         $20 = $17 + 1 | 0;
         $19 = $20 ? $16 : $16 + 1 | 0;
         $4 = $17 & 3 ^ 2;
         if ($4) {
          $11 = 0;
          $6 = 0;
          $15 = 0 - $4 | 0;
          $4 = 0 - (($4 | 0) != 0) | 0;
          while (1) {
           HEAP8[$26 | 0] = HEAPU8[$7 + $26 | 0];
           $26 = $26 + 1 | 0;
           $2 = $6 - 1 | 0;
           $11 = $11 - 1 | 0;
           $6 = ($11 | 0) != -1 ? $2 + 1 | 0 : $2;
           if (($11 | 0) != ($15 | 0) | ($4 | 0) != ($6 | 0)) {
            continue
           }
           break;
          };
          $2 = $13 - (($11 >>> 0 > $12 >>> 0) + $6 | 0) | 0;
          $6 = $2 + 1 | 0;
          $4 = $2;
          $2 = ($12 - $11 | 0) + 2 | 0;
          $15 = $2 >>> 0 < 2 ? $6 : $4;
         }
         $4 = $16 + $27 | 0;
         $12 = $17 + $24 | 0;
         $13 = $12 >>> 0 < $24 >>> 0 ? $4 + 1 | 0 : $4;
         if (!$19 & $20 >>> 0 < 3) {
          break block35
         }
         $11 = $2 - $17 | 0;
         $6 = $15 - (($2 >>> 0 < $17 >>> 0) + $16 | 0) | 0;
         $4 = $2 + $22 | 0;
         while (1) {
          $2 = $4 + $7 | 0;
          HEAP8[$4 | 0] = HEAPU8[$2 | 0];
          HEAP8[$4 + 1 | 0] = HEAPU8[$2 + 1 | 0];
          HEAP8[$4 + 2 | 0] = HEAPU8[$2 + 2 | 0];
          HEAP8[$4 + 3 | 0] = HEAPU8[$2 + 3 | 0];
          $4 = $4 + 4 | 0;
          $11 = $11 + 4 | 0;
          $6 = $11 >>> 0 < 4 ? $6 + 1 | 0 : $6;
          if (($11 | 0) != ($24 | 0) | ($6 | 0) != ($27 | 0)) {
           continue
          }
          break;
         };
        }
        if (($13 | 0) == ($21 | 0) & $12 >>> 0 < $25 >>> 0 | $13 >>> 0 < $21 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block37;
     }
     $4 = $12 + $22 | 0;
     while (1) {
      HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
      $4 = $4 + 1 | 0;
      $12 = $12 + 1 | 0;
      $13 = $12 ? $13 : $13 + 1 | 0;
      if (($18 | 0) == ($13 | 0) & $12 >>> 0 < $23 >>> 0 | $13 >>> 0 < $18 >>> 0) {
       continue
      }
      break;
     };
     $0 = $1 + 256 | 0;
     HEAP32[$0 >> 2] = $2;
     HEAP32[$0 + 4 >> 2] = $15;
     HEAP32[$1 + 248 >> 2] = $11 - $23;
     HEAP32[$1 + 252 >> 2] = $6 - (($11 >>> 0 < $23 >>> 0) + $18 | 0);
     break block37;
    }
    wasm2js_trap();
   }
   HEAP32[$1 + 200 >> 2] = $3;
   HEAP32[$1 + 192 >> 2] = $8;
   HEAP32[$1 + 196 >> 2] = $9;
   HEAP32[$1 + 184 >> 2] = $10;
   HEAP32[$1 + 188 >> 2] = $5;
   HEAP32[$1 + 48 >> 2] = $12;
   HEAP32[$1 + 52 >> 2] = $13;
  }
  __stack_pointer = $14 + 208 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount2_Ptr3_Mtf2($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
  $12 = __stack_pointer - 272 | 0;
  __stack_pointer = $12;
  $5 = $1 - -64 | 0;
  $26 = HEAP32[$5 >> 2];
  $22 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $3 = $1 + 56 | 0;
  $27 = HEAP32[$3 >> 2];
  block2 : {
   block1 : {
    $14 = HEAP32[$5 + 4 >> 2];
    $2 = $14;
    $24 = HEAP32[$3 + 4 >> 2];
    $5 = $24;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $27 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($22 | 0) & $26 >>> 0 >= $27 >>> 0 | $5 >>> 0 < $22 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $12 + 40 | 0;
    HEAP32[$1 >> 2] = $26;
    HEAP32[$1 + 4 >> 2] = $22;
    $1 = $12 + 32 | 0;
    HEAP32[$1 >> 2] = $27;
    HEAP32[$1 + 4 >> 2] = $24;
    $1 = $12 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $14;
    HEAP32[$12 + 12 >> 2] = 42;
    HEAP32[$12 + 16 >> 2] = 0;
    HEAP32[$12 + 8 >> 2] = 3772;
    HEAP32[$12 + 4 >> 2] = 5287;
    HEAP32[$12 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 144 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 256 >> 2] = 2;
    $1 = $12 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 236 >> 2] = 50;
    HEAP32[$12 + 240 >> 2] = 0;
    HEAP32[$12 + 232 >> 2] = 3772;
    HEAP32[$12 + 228 >> 2] = 5287;
    HEAP32[$12 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 160 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 208 >> 2] = 2;
    $1 = $12 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 188 >> 2] = 58;
    HEAP32[$12 + 192 >> 2] = 0;
    HEAP32[$12 + 184 >> 2] = 3772;
    HEAP32[$12 + 180 >> 2] = 5287;
    HEAP32[$12 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 152 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 160 >> 2] = 3;
    $1 = $12 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 140 >> 2] = 66;
    HEAP32[$12 + 144 >> 2] = 0;
    HEAP32[$12 + 136 >> 2] = 3772;
    HEAP32[$12 + 132 >> 2] = 5287;
    HEAP32[$12 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $31 = HEAP32[$1 + 176 >> 2];
   $32 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 224 | 0;
   $2 = HEAP32[$5 >> 2];
   $6 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $19 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $17 = HEAP32[$5 >> 2];
   $20 = HEAP32[$5 + 4 >> 2];
   $25 = HEAP32[$1 + 264 >> 2];
   $8 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $10 = HEAP32[$5 >> 2];
   $11 = HEAP32[$5 + 4 >> 2];
   $3 = $1 + 184 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   $15 = $1 + 248 | 0;
   $4 = HEAP32[$15 >> 2];
   $15 = HEAP32[$15 + 4 >> 2];
   $16 = $15;
   block41 : {
    block8 : {
     block28 : {
      block9 : {
       if ($4 | $15) {
        $9 = $1 + 256 | 0;
        $7 = HEAP32[$9 >> 2];
        $15 = 0 - $7 | 0;
        $9 = HEAP32[$9 + 4 >> 2];
        $18 = 0 - ($9 + (($7 | 0) != 0) | 0) | 0;
        if (!(($18 | 0) == ($14 | 0) & $13 >>> 0 >= $15 >>> 0 | $14 >>> 0 > $18 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 + 112 | 0;
         HEAP32[$3 >> 2] = $15;
         HEAP32[$3 + 4 >> 2] = $18;
         HEAP32[$12 + 104 >> 2] = $5;
         HEAP32[$12 + 108 >> 2] = $1;
         HEAP32[$12 + 96 >> 2] = $13;
         HEAP32[$12 + 100 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $15 = $14 + $16 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (($22 | 0) == ($16 | 0) & $15 >>> 0 > $26 >>> 0 | $16 >>> 0 > $22 >>> 0) {
         break block8
        }
        $4 = $13 + $25 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
         $4 = $4 + 1 | 0;
         $13 = $13 + 1 | 0;
         $14 = $13 ? $14 : $14 + 1 | 0;
         if (($16 | 0) == ($14 | 0) & $13 >>> 0 < $15 >>> 0 | $14 >>> 0 < $16 >>> 0) {
          continue
         }
         break;
        };
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 >= $27 >>> 0 | $14 >>> 0 > $24 >>> 0) {
         break block9
        }
       }
       $33 = $25 + 2 | 0;
       while (1) {
        $15 = $2;
        $18 = $6;
        $28 = $13 + $33 | 0;
        block17 : {
         while (1) {
          $7 = HEAP16[(($5 & 4095) << 1) + $32 >> 1];
          $9 = $7 >> 31;
          block11 : {
           if (($7 | 0) >= 0) {
            $2 = $8;
            break block11;
           }
           $4 = $7 & 15;
           $2 = $4;
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
           $3 = $6;
           $2 = $10;
           $10 = $2 - $4 | 0;
           $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
           if (($11 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($11 | 0) < 0
           }
           block13 : {
            if (!$2) {
             $2 = $8;
             break block13;
            }
            $2 = $8 + 4 | 0;
            $4 = HEAP32[$8 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $8 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $4 << $8;
             $8 = 0;
            } else {
             $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
             $8 = $4 << $8;
            }
            $8 = $8 + $5 | 0;
            $3 = $3 + $6 | 0;
            $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
            $5 = $8;
           }
           $8 = (($7 & 2147483632) << 1) + $32 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) >= 0) {
            break block11
           }
           while (1) {
            $7 = $7 & 15;
            $6 = $3 >>> $7 | 0;
            $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
            $3 = $10;
            $10 = $3 - $7 | 0;
            $9 = $6;
            $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
            $6 = $9;
            block14 : {
             if (($11 | 0) >= 0) {
              break block14
             }
             $7 = HEAP32[$2 >> 2];
             $10 = $10 + 32 | 0;
             $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
             $3 = $10 & 31;
             if (($10 & 63) >>> 0 >= 32) {
              $6 = $7 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
              $3 = $7 << $3;
             }
             $3 = $3 + $5 | 0;
             $6 = $6 + $9 | 0;
             $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
             $5 = $3;
             $2 = $2 + 4 | 0;
            }
            $3 = $6;
            $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
            $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
            $7 = $4;
            $9 = $4 >> 31;
            if (($4 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $8 = $7 & 15;
          $6 = $3 >>> $8 | 0;
          $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
          $3 = $6;
          $6 = $10;
          $10 = $10 - $8 | 0;
          $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $6 = 1
          } else {
           $6 = ($11 | 0) < 0
          }
          block16 : {
           if (!$6) {
            $8 = $2;
            break block16;
           }
           $8 = $2 + 4 | 0;
           $4 = HEAP32[$2 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $21 = ($9 & 15) << 28 | $7 >>> 4;
          $29 = $9 >>> 4 | 0;
          if (!$9 & $7 >>> 0 > 4095 | $9) {
           break block17
          }
          HEAP8[$13 + $25 | 0] = $21;
          $28 = $28 + 1 | 0;
          $17 = 0;
          $20 = 0;
          $13 = $13 + 1 | 0;
          $14 = $13 ? $14 : $14 + 1 | 0;
          if (($24 | 0) == ($14 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
           continue
          }
          break;
         };
         $2 = $15;
         $6 = $18;
         break block9;
        }
        $7 = $21 & 15;
        if (($7 | 0) != 15) {
         $16 = 0
        } else {
         $7 = HEAP16[(($5 & 4095) << 1) + $31 >> 1];
         $9 = $7 >> 31;
         block20 : {
          if (($7 | 0) >= 0) {
           $2 = $8;
           break block20;
          }
          $4 = $7 & 15;
          $2 = $4;
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          $3 = $6;
          $2 = $10;
          $10 = $2 - $4 | 0;
          $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $8;
            break block22;
           }
           $2 = $8 + 4 | 0;
           $4 = HEAP32[$8 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $8 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $8;
            $8 = 0;
           } else {
            $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
            $8 = $4 << $8;
           }
           $8 = $8 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $8;
          }
          $8 = (($7 & 2147483632) << 1) + $31 | 0;
          $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
          $7 = $4;
          $9 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $7 = $7 & 15;
           $6 = $3 >>> $7 | 0;
           $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
           $3 = $10;
           $10 = $3 - $7 | 0;
           $9 = $6;
           $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
           $6 = $9;
           block23 : {
            if (($11 | 0) >= 0) {
             break block23
            }
            $7 = HEAP32[$2 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $3 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $7 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
             $3 = $7 << $3;
            }
            $3 = $3 + $5 | 0;
            $6 = $6 + $9 | 0;
            $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
            $5 = $3;
            $2 = $2 + 4 | 0;
           }
           $3 = $6;
           $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $8 = $7 & 15;
         $6 = $3 >>> $8 | 0;
         $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
         $3 = $6;
         $6 = $10;
         $10 = $10 - $8 | 0;
         $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
         if (($11 | 0) < -1) {
          $6 = 1
         } else {
          $6 = ($11 | 0) < 0
         }
         block25 : {
          if (!$6) {
           $4 = $2;
           break block25;
          }
          $4 = $2 + 4 | 0;
          $8 = HEAP32[$2 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $8 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
           $2 = $8 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $5 = $2;
         }
         $2 = ($9 & 15) << 28 | $7 >>> 4;
         $6 = $9 >>> 4 | 0;
         block27 : {
          if (!(!$9 & $7 >>> 0 >= 3712 | ($9 | 0) != 0)) {
           $8 = $4;
           break block27;
          }
          $6 = $6 - 1 | 0;
          $8 = $2 - 232 | 0;
          $9 = $8 >>> 0 < 4294967064 ? $6 + 1 | 0 : $6;
          if (!$9 & $8 >>> 0 >= 33 | $9) {
           break block28
          }
          $7 = $8 << 3;
          $2 = $7 + 6656 | 0;
          $16 = $5 & HEAP32[$2 >> 2];
          $30 = $3 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $3 >>> $2 | 0;
          } else {
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          }
          $3 = $6;
          $2 = $10;
          $10 = $2 - $8 | 0;
          $11 = $11 - (($2 >>> 0 < $8 >>> 0) + $9 | 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $8 = $4;
            break block30;
           }
           $8 = $4 + 4 | 0;
           $4 = HEAP32[$4 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $6 = $7 + 6400 | 0;
          $4 = HEAP32[$6 >> 2];
          $2 = $4 + $16 | 0;
          $6 = HEAP32[$6 + 4 >> 2] + $30 | 0;
          $6 = $2 >>> 0 < $4 >>> 0 ? $6 + 1 | 0 : $6;
          $2 = $2 + 231 | 0;
          $6 = $2 >>> 0 < 231 ? $6 + 1 | 0 : $6;
         }
         $7 = $2 + 15 | 0;
         $16 = $7 >>> 0 < 15 ? $6 + 1 | 0 : $6;
        }
        $2 = $29 - 1 | 0;
        $21 = $21 - 256 | 0;
        $9 = $21 >>> 0 < 4294967040 ? $2 + 1 | 0 : $2;
        block33 : {
         if (!(!$9 & $21 >>> 0 > 31 | ($9 | 0) != 0)) {
          $4 = $7 + 2 | 0;
          $29 = $4 >>> 0 < 2 ? $16 + 1 | 0 : $16;
          if ($17 | $20) {
           $2 = $19;
           $6 = $23;
           $19 = $15;
           if (!$9 & $21 >>> 0 < 16) {
            break block33
           }
           HEAP32[$0 >> 2] = 9;
           HEAP32[$12 + 80 >> 2] = $13;
           HEAP32[$12 + 84 >> 2] = $14;
           HEAP8[$0 + 16 | 0] = 0;
           break block2;
          }
          $9 = !$9 & $21 >>> 0 < 16;
          $2 = $9 ? $15 : $19;
          $6 = $9 ? $18 : $23;
          $19 = $9 ? $19 : $15;
          $18 = $9 ? $23 : $18;
          break block33;
         }
         $2 = ($9 >>> 4 | 0) - 1 | 0;
         $4 = (($9 & 15) << 28 | $21 >>> 4) - 2 | 0;
         $15 = $4 >>> 0 < 4294967294 ? $2 + 1 | 0 : $2;
         if (!$15 & $4 >>> 0 >= 33 | $15) {
          break block28
         }
         $18 = $4 << 3;
         $2 = $18 + 6656 | 0;
         $9 = $5 & HEAP32[$2 >> 2];
         $17 = $3 & HEAP32[$2 + 4 >> 2];
         $2 = $4 & 31;
         if (($4 & 63) >>> 0 >= 32) {
          $6 = 0;
          $5 = $3 >>> $2 | 0;
         } else {
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
         }
         $3 = $6;
         $2 = $10;
         $10 = $2 - $4 | 0;
         $11 = $11 - (($2 >>> 0 < $4 >>> 0) + $15 | 0) | 0;
         if (($11 | 0) < 0) {
          $4 = HEAP32[$8 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $4 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
           $2 = $4 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $8 = $8 + 4 | 0;
          $5 = $2;
         }
         $4 = $7 + 3 | 0;
         $29 = $4 >>> 0 < 3 ? $16 + 1 | 0 : $16;
         $2 = $19;
         $6 = $23;
         $19 = $18 + 6400 | 0;
         $15 = HEAP32[$19 >> 2];
         $19 = $17 + HEAP32[$19 + 4 >> 2] | 0;
         $18 = $19 + 1 | 0;
         $7 = $19;
         $19 = $9 + $15 | 0;
         $18 = $19 >>> 0 < $9 >>> 0 ? $18 : $7;
        }
        $23 = $18;
        if (!(($14 | 0) == ($23 | 0) & $13 >>> 0 >= $19 >>> 0 | $14 >>> 0 > $23 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 - -64 | 0;
         HEAP32[$3 >> 2] = $19;
         HEAP32[$3 + 4 >> 2] = $23;
         HEAP32[$12 + 56 >> 2] = $5;
         HEAP32[$12 + 60 >> 2] = $1;
         HEAP32[$12 + 48 >> 2] = $13;
         HEAP32[$12 + 52 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $7 = 0 - $19 | 0;
        $9 = 0 - ((($19 | 0) != 0) + $23 | 0) | 0;
        $15 = $14 + $29 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (!(($22 | 0) == ($16 | 0) & $15 >>> 0 <= $26 >>> 0 | $16 >>> 0 < $22 >>> 0)) {
         $17 = 1;
         $20 = 0;
         break block8;
        }
        $18 = $7;
        $9 = $7 + $25 | 0;
        HEAP8[$13 + $25 | 0] = HEAPU8[$9 + $13 | 0];
        $7 = $13 + 1 | 0;
        HEAP8[$7 + $25 | 0] = HEAPU8[$9 + $7 | 0];
        $17 = $13 + 2 | 0;
        $20 = $17 >>> 0 < 2 ? $14 + 1 | 0 : $14;
        block38 : {
         if (!(($16 | 0) == ($20 | 0) & $15 >>> 0 > $17 >>> 0 | $16 >>> 0 > $20 >>> 0)) {
          $13 = $17;
          $4 = $20;
          break block38;
         }
         $9 = $29 - 1 | 0;
         $30 = $4 - 3 | 0;
         $34 = $30 >>> 0 < 4294967293 ? $9 + 1 | 0 : $9;
         $21 = $4 & 3 ^ 2;
         if ($21) {
          $7 = 0;
          $9 = 0;
          $17 = 0 - $21 | 0;
          $20 = 0 - (($21 | 0) != 0) | 0;
          while (1) {
           HEAP8[$28 | 0] = HEAPU8[$18 + $28 | 0];
           $28 = $28 + 1 | 0;
           $9 = $9 - 1 | 0;
           $7 = $7 - 1 | 0;
           $9 = ($7 | 0) != -1 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($17 | 0) | ($9 | 0) != ($20 | 0)) {
            continue
           }
           break;
          };
          $9 = $14 - (($7 >>> 0 > $13 >>> 0) + $9 | 0) | 0;
          $17 = ($13 - $7 | 0) + 2 | 0;
          $20 = $17 >>> 0 < 2 ? $9 + 1 | 0 : $9;
         }
         if (!(!$34 & $30 >>> 0 < 3)) {
          $7 = $17 - $4 | 0;
          $9 = $20 - (($4 >>> 0 > $17 >>> 0) + $29 | 0) | 0;
          $4 = $17 + $25 | 0;
          while (1) {
           $17 = $4 + $18 | 0;
           HEAP8[$4 | 0] = HEAPU8[$17 | 0];
           HEAP8[$4 + 1 | 0] = HEAPU8[$17 + 1 | 0];
           HEAP8[$4 + 2 | 0] = HEAPU8[$17 + 2 | 0];
           HEAP8[$4 + 3 | 0] = HEAPU8[$17 + 3 | 0];
           $4 = $4 + 4 | 0;
           $7 = $7 + 4 | 0;
           $9 = $7 >>> 0 < 4 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($13 | 0) | ($9 | 0) != ($14 | 0)) {
            continue
           }
           break;
          };
         }
         $13 = $15;
         $4 = $16;
        }
        $14 = $4;
        $17 = 1;
        $20 = 0;
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block41;
     }
     wasm2js_trap();
    }
    $4 = $13 + $25 | 0;
    while (1) {
     HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
     $4 = $4 + 1 | 0;
     $13 = $13 + 1 | 0;
     $14 = $13 ? $14 : $14 + 1 | 0;
     if (($22 | 0) == ($14 | 0) & $13 >>> 0 < $26 >>> 0 | $14 >>> 0 < $22 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $7;
    HEAP32[$0 + 4 >> 2] = $9;
    HEAP32[$1 + 248 >> 2] = $15 - $26;
    HEAP32[$1 + 252 >> 2] = $16 - (($15 >>> 0 < $26 >>> 0) + $22 | 0);
   }
   HEAP32[$1 + 224 >> 2] = $2;
   HEAP32[$1 + 228 >> 2] = $6;
   HEAP32[$1 + 216 >> 2] = $19;
   HEAP32[$1 + 220 >> 2] = $23;
   HEAP32[$1 + 208 >> 2] = $17;
   HEAP32[$1 + 212 >> 2] = $20;
   HEAP32[$1 + 200 >> 2] = $8;
   HEAP32[$1 + 192 >> 2] = $10;
   HEAP32[$1 + 196 >> 2] = $11;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $3;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $14;
  }
  __stack_pointer = $12 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount2_Ptr3_Mtf3($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0;
  $12 = __stack_pointer - 272 | 0;
  __stack_pointer = $12;
  $3 = $1 - -64 | 0;
  $25 = HEAP32[$3 >> 2];
  $20 = HEAP32[$3 + 4 >> 2];
  $3 = $1 + 48 | 0;
  $13 = HEAP32[$3 >> 2];
  $6 = $1 + 56 | 0;
  $27 = HEAP32[$6 >> 2];
  block2 : {
   block1 : {
    $14 = HEAP32[$3 + 4 >> 2];
    $3 = $14;
    $23 = HEAP32[$6 + 4 >> 2];
    $6 = $23;
    if (!(($3 | 0) == ($6 | 0) & $13 >>> 0 >= $27 >>> 0 | $3 >>> 0 > $6 >>> 0)) {
     if (($6 | 0) == ($20 | 0) & $25 >>> 0 >= $27 >>> 0 | $6 >>> 0 < $20 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $12 + 40 | 0;
    HEAP32[$1 >> 2] = $25;
    HEAP32[$1 + 4 >> 2] = $20;
    $1 = $12 + 32 | 0;
    HEAP32[$1 >> 2] = $27;
    HEAP32[$1 + 4 >> 2] = $23;
    $1 = $12 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $14;
    HEAP32[$12 + 12 >> 2] = 42;
    HEAP32[$12 + 16 >> 2] = 0;
    HEAP32[$12 + 8 >> 2] = 3772;
    HEAP32[$12 + 4 >> 2] = 5098;
    HEAP32[$12 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 144 | 0;
   $6 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($6 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 256 >> 2] = 2;
    $1 = $12 + 248 | 0;
    HEAP32[$1 >> 2] = $6;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 236 >> 2] = 50;
    HEAP32[$12 + 240 >> 2] = 0;
    HEAP32[$12 + 232 >> 2] = 3772;
    HEAP32[$12 + 228 >> 2] = 5098;
    HEAP32[$12 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 160 | 0;
   $6 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($6 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 208 >> 2] = 3;
    $1 = $12 + 200 | 0;
    HEAP32[$1 >> 2] = $6;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 188 >> 2] = 58;
    HEAP32[$12 + 192 >> 2] = 0;
    HEAP32[$12 + 184 >> 2] = 3772;
    HEAP32[$12 + 180 >> 2] = 5098;
    HEAP32[$12 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 152 | 0;
   $6 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($6 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 160 >> 2] = 3;
    $1 = $12 + 152 | 0;
    HEAP32[$1 >> 2] = $6;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 140 >> 2] = 66;
    HEAP32[$12 + 144 >> 2] = 0;
    HEAP32[$12 + 136 >> 2] = 3772;
    HEAP32[$12 + 132 >> 2] = 5098;
    HEAP32[$12 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $33 = HEAP32[$1 + 176 >> 2];
   $34 = HEAP32[$1 + 172 >> 2];
   $3 = $1 + 224 | 0;
   $5 = HEAP32[$3 >> 2];
   $7 = HEAP32[$3 + 4 >> 2];
   $3 = $1 + 216 | 0;
   $19 = HEAP32[$3 >> 2];
   $21 = HEAP32[$3 + 4 >> 2];
   $3 = $1 + 208 | 0;
   $29 = HEAP32[$3 >> 2];
   $30 = HEAP32[$3 + 4 >> 2];
   $24 = HEAP32[$1 + 264 >> 2];
   $8 = HEAP32[$1 + 200 >> 2];
   $3 = $1 + 192 | 0;
   $9 = HEAP32[$3 >> 2];
   $11 = HEAP32[$3 + 4 >> 2];
   $3 = $1 + 184 | 0;
   $6 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   $2 = $1 + 248 | 0;
   $17 = HEAP32[$2 >> 2];
   $2 = HEAP32[$2 + 4 >> 2];
   $10 = $2;
   block40 : {
    block8 : {
     block28 : {
      block9 : {
       if ($2 | $17) {
        $4 = $1 + 256 | 0;
        $2 = HEAP32[$4 >> 2];
        $22 = 0 - $2 | 0;
        $16 = HEAP32[$4 + 4 >> 2];
        $4 = 0 - ($16 + (($2 | 0) != 0) | 0) | 0;
        if (!(($4 | 0) == ($14 | 0) & $13 >>> 0 >= $22 >>> 0 | $4 >>> 0 < $14 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $6 = HEAP32[$1 + 40 >> 2];
         $3 = HEAP32[$1 + 44 >> 2];
         $1 = $12 + 112 | 0;
         HEAP32[$1 >> 2] = $22;
         HEAP32[$1 + 4 >> 2] = $4;
         HEAP32[$12 + 104 >> 2] = $6;
         HEAP32[$12 + 108 >> 2] = $3;
         HEAP32[$12 + 96 >> 2] = $13;
         HEAP32[$12 + 100 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $4 = $10 + $14 | 0;
        $15 = $13 + $17 | 0;
        $10 = $15 >>> 0 < $13 >>> 0 ? $4 + 1 | 0 : $4;
        if (($20 | 0) == ($10 | 0) & $15 >>> 0 > $25 >>> 0 | $10 >>> 0 > $20 >>> 0) {
         break block8
        }
        $4 = $13 + $24 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
         $4 = $4 + 1 | 0;
         $13 = $13 + 1 | 0;
         $14 = $13 ? $14 : $14 + 1 | 0;
         if (($10 | 0) == ($14 | 0) & $15 >>> 0 > $13 >>> 0 | $10 >>> 0 > $14 >>> 0) {
          continue
         }
         break;
        };
        if (($14 | 0) == ($23 | 0) & $13 >>> 0 >= $27 >>> 0 | $14 >>> 0 > $23 >>> 0) {
         break block9
        }
       }
       $35 = $24 + 2 | 0;
       while (1) {
        $17 = $5;
        $16 = $7;
        $26 = $13 + 3 | 0;
        $31 = $26 >>> 0 < 3 ? $14 + 1 | 0 : $14;
        $28 = $13 + $35 | 0;
        block17 : {
         while (1) {
          $7 = HEAP16[(($6 & 4095) << 1) + $34 >> 1];
          $15 = $7;
          $10 = $7 >> 31;
          block11 : {
           if (($7 | 0) >= 0) {
            $2 = $8;
            break block11;
           }
           $4 = $15 & 15;
           $2 = $4;
           $5 = $3 >>> $2 | 0;
           $6 = ((1 << $2) - 1 & $3) << 32 - $2 | $6 >>> $2;
           $3 = $5;
           $2 = $9;
           $9 = $2 - $4 | 0;
           $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
           if (($11 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($11 | 0) < 0
           }
           block13 : {
            if (!$2) {
             $2 = $8;
             break block13;
            }
            $2 = $8 + 4 | 0;
            $8 = HEAP32[$8 >> 2];
            $9 = $9 + 32 | 0;
            $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $4 = $9 & 31;
            if (($9 & 63) >>> 0 >= 32) {
             $5 = $8 << $4;
             $8 = 0;
            } else {
             $5 = (1 << $4) - 1 & $8 >>> 32 - $4;
             $8 = $8 << $4;
            }
            $8 = $8 + $6 | 0;
            $3 = $3 + $5 | 0;
            $3 = $6 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
            $6 = $8;
           }
           $8 = (($7 & 2147483632) << 1) + $34 | 0;
           $4 = HEAP16[$8 + (($6 & 63) << 1) >> 1];
           $15 = $4;
           $10 = $4 >> 31;
           if (($4 | 0) >= 0) {
            break block11
           }
           while (1) {
            $7 = $15 & 15;
            $5 = $3 >>> $7 | 0;
            $6 = ((1 << $7) - 1 & $3) << 32 - $7 | $6 >>> $7;
            $3 = $5;
            $5 = $9;
            $9 = $9 - $7 | 0;
            $11 = $11 - ($5 >>> 0 < $7 >>> 0) | 0;
            if (($11 | 0) < 0) {
             $7 = HEAP32[$2 >> 2];
             $9 = $9 + 32 | 0;
             $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
             $10 = $9 & 31;
             if (($9 & 63) >>> 0 >= 32) {
              $5 = $7 << $10;
              $7 = 0;
             } else {
              $5 = (1 << $10) - 1 & $7 >>> 32 - $10;
              $7 = $7 << $10;
             }
             $7 = $7 + $6 | 0;
             $3 = $3 + $5 | 0;
             $3 = $6 >>> 0 > $7 >>> 0 ? $3 + 1 | 0 : $3;
             $2 = $2 + 4 | 0;
             $6 = $7;
            }
            $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
            $4 = HEAP16[$8 + (($6 & 63) << 1) >> 1];
            $15 = $4;
            $10 = $4 >> 31;
            if (($4 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $8 = $15 & 15;
          $5 = $3 >>> $8 | 0;
          $6 = ((1 << $8) - 1 & $3) << 32 - $8 | $6 >>> $8;
          $3 = $5;
          $5 = $9;
          $9 = $9 - $8 | 0;
          $11 = $11 - ($5 >>> 0 < $8 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $5 = 1
          } else {
           $5 = ($11 | 0) < 0
          }
          block16 : {
           if (!$5) {
            $8 = $2;
            break block16;
           }
           $8 = $2 + 4 | 0;
           $2 = HEAP32[$2 >> 2];
           $9 = $9 + 32 | 0;
           $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $7 = $9 & 31;
           if (($9 & 63) >>> 0 >= 32) {
            $5 = $2 << $7;
            $2 = 0;
           } else {
            $5 = (1 << $7) - 1 & $2 >>> 32 - $7;
            $2 = $2 << $7;
           }
           $2 = $2 + $6 | 0;
           $3 = $3 + $5 | 0;
           $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
           $6 = $2;
          }
          $32 = ($10 & 15) << 28 | $15 >>> 4;
          $36 = $10 >>> 4 | 0;
          if (!$10 & $15 >>> 0 > 4095 | $10) {
           break block17
          }
          HEAP8[$13 + $24 | 0] = $32;
          $28 = $28 + 1 | 0;
          $26 = $26 + 1 | 0;
          $31 = $26 ? $31 : $31 + 1 | 0;
          $29 = 0;
          $30 = 0;
          $13 = $13 + 1 | 0;
          $14 = $13 ? $14 : $14 + 1 | 0;
          if (($23 | 0) == ($14 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $23 >>> 0) {
           continue
          }
          break;
         };
         $5 = $17;
         $7 = $16;
         break block9;
        }
        $18 = $32 & 15;
        if (($18 | 0) != 15) {
         $2 = 0
        } else {
         $7 = HEAP16[(($6 & 4095) << 1) + $33 >> 1];
         $15 = $7;
         $10 = $7 >> 31;
         block20 : {
          if (($7 | 0) >= 0) {
           $2 = $8;
           break block20;
          }
          $4 = $15 & 15;
          $2 = $4;
          $5 = $3 >>> $2 | 0;
          $6 = ((1 << $2) - 1 & $3) << 32 - $2 | $6 >>> $2;
          $3 = $5;
          $2 = $9;
          $9 = $2 - $4 | 0;
          $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $8;
            break block22;
           }
           $2 = $8 + 4 | 0;
           $8 = HEAP32[$8 >> 2];
           $9 = $9 + 32 | 0;
           $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $4 = $9 & 31;
           if (($9 & 63) >>> 0 >= 32) {
            $5 = $8 << $4;
            $8 = 0;
           } else {
            $5 = (1 << $4) - 1 & $8 >>> 32 - $4;
            $8 = $8 << $4;
           }
           $8 = $8 + $6 | 0;
           $3 = $3 + $5 | 0;
           $3 = $6 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
           $6 = $8;
          }
          $8 = (($7 & 2147483632) << 1) + $33 | 0;
          $4 = HEAP16[$8 + (($6 & 63) << 1) >> 1];
          $15 = $4;
          $10 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $7 = $15 & 15;
           $5 = $3 >>> $7 | 0;
           $6 = ((1 << $7) - 1 & $3) << 32 - $7 | $6 >>> $7;
           $3 = $5;
           $5 = $9;
           $9 = $9 - $7 | 0;
           $11 = $11 - ($5 >>> 0 < $7 >>> 0) | 0;
           if (($11 | 0) < 0) {
            $7 = HEAP32[$2 >> 2];
            $9 = $9 + 32 | 0;
            $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $10 = $9 & 31;
            if (($9 & 63) >>> 0 >= 32) {
             $5 = $7 << $10;
             $7 = 0;
            } else {
             $5 = (1 << $10) - 1 & $7 >>> 32 - $10;
             $7 = $7 << $10;
            }
            $7 = $7 + $6 | 0;
            $3 = $3 + $5 | 0;
            $3 = $6 >>> 0 > $7 >>> 0 ? $3 + 1 | 0 : $3;
            $2 = $2 + 4 | 0;
            $6 = $7;
           }
           $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
           $4 = HEAP16[$8 + (($6 & 63) << 1) >> 1];
           $15 = $4;
           $10 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $8 = $15 & 15;
         $5 = $3 >>> $8 | 0;
         $6 = ((1 << $8) - 1 & $3) << 32 - $8 | $6 >>> $8;
         $3 = $5;
         $5 = $9;
         $9 = $9 - $8 | 0;
         $11 = $11 - ($5 >>> 0 < $8 >>> 0) | 0;
         if (($11 | 0) < -1) {
          $5 = 1
         } else {
          $5 = ($11 | 0) < 0
         }
         block25 : {
          if (!$5) {
           $4 = $2;
           break block25;
          }
          $4 = $2 + 4 | 0;
          $2 = HEAP32[$2 >> 2];
          $9 = $9 + 32 | 0;
          $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $8 = $9 & 31;
          if (($9 & 63) >>> 0 >= 32) {
           $5 = $2 << $8;
           $2 = 0;
          } else {
           $5 = (1 << $8) - 1 & $2 >>> 32 - $8;
           $2 = $2 << $8;
          }
          $2 = $2 + $6 | 0;
          $3 = $3 + $5 | 0;
          $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
          $6 = $2;
         }
         $5 = ($10 & 15) << 28 | $15 >>> 4;
         $7 = $10 >>> 4 | 0;
         block27 : {
          if (!(!$10 & $15 >>> 0 >= 3712 | ($10 | 0) != 0)) {
           $8 = $4;
           break block27;
          }
          $2 = $7 - 1 | 0;
          $18 = $5 - 232 | 0;
          $8 = $18 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
          if (!$8 & $18 >>> 0 >= 33 | $8) {
           break block28
          }
          $22 = $18 << 3;
          $2 = $22 + 6656 | 0;
          $10 = $6 & HEAP32[$2 >> 2];
          $7 = $3 & HEAP32[$2 + 4 >> 2];
          $2 = $18 & 31;
          if (($18 & 63) >>> 0 >= 32) {
           $5 = 0;
           $6 = $3 >>> $2 | 0;
          } else {
           $5 = $3 >>> $2 | 0;
           $6 = ((1 << $2) - 1 & $3) << 32 - $2 | $6 >>> $2;
          }
          $3 = $5;
          $2 = $9;
          $9 = $2 - $18 | 0;
          $11 = $11 - (($2 >>> 0 < $18 >>> 0) + $8 | 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $8 = $4;
            break block30;
           }
           $8 = $4 + 4 | 0;
           $2 = HEAP32[$4 >> 2];
           $9 = $9 + 32 | 0;
           $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $4 = $9 & 31;
           if (($9 & 63) >>> 0 >= 32) {
            $5 = $2 << $4;
            $2 = 0;
           } else {
            $5 = (1 << $4) - 1 & $2 >>> 32 - $4;
            $2 = $2 << $4;
           }
           $2 = $2 + $6 | 0;
           $3 = $3 + $5 | 0;
           $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
           $6 = $2;
          }
          $2 = $22 + 6400 | 0;
          $5 = HEAP32[$2 >> 2];
          $4 = $5 + $10 | 0;
          $2 = HEAP32[$2 + 4 >> 2] + $7 | 0;
          $2 = $4 >>> 0 < $5 >>> 0 ? $2 + 1 | 0 : $2;
          $5 = $4 + 231 | 0;
          $7 = $5 >>> 0 < 231 ? $2 + 1 | 0 : $2;
         }
         $18 = $5 + 15 | 0;
         $2 = $18 >>> 0 < 15 ? $7 + 1 | 0 : $7;
        }
        $22 = $2;
        $2 = $36 - 1 | 0;
        $4 = $32 - 256 | 0;
        $5 = $4 >>> 0 < 4294967040 ? $2 + 1 | 0 : $2;
        $2 = !$5;
        block33 : {
         if (!($2 & $4 >>> 0 > 31 | ($5 | 0) != 0)) {
          if ($29 | $30) {
           $5 = $19;
           $7 = $21;
           $19 = $17;
           if ($4 >>> 0 < 16 & $2) {
            break block33
           }
           HEAP32[$0 >> 2] = 9;
           HEAP32[$12 + 80 >> 2] = $13;
           HEAP32[$12 + 84 >> 2] = $14;
           HEAP8[$0 + 16 | 0] = 0;
           break block2;
          }
          $2 = !$5 & $4 >>> 0 < 16;
          $5 = $2 ? $17 : $19;
          $7 = $2 ? $16 : $21;
          $19 = $2 ? $19 : $17;
          $16 = $2 ? $21 : $16;
          break block33;
         }
         $2 = ($5 >>> 4 | 0) - 1 | 0;
         $10 = (($5 & 15) << 28 | $4 >>> 4) - 2 | 0;
         $7 = $10 >>> 0 < 4294967294 ? $2 + 1 | 0 : $2;
         if (!$7 & $10 >>> 0 >= 33 | $7) {
          break block28
         }
         $17 = $10 << 3;
         $2 = $17 + 6656 | 0;
         $16 = $6 & HEAP32[$2 >> 2];
         $4 = $3 & HEAP32[$2 + 4 >> 2];
         $2 = $10 & 31;
         if (($10 & 63) >>> 0 >= 32) {
          $5 = 0;
          $6 = $3 >>> $2 | 0;
         } else {
          $5 = $3 >>> $2 | 0;
          $6 = ((1 << $2) - 1 & $3) << 32 - $2 | $6 >>> $2;
         }
         $3 = $5;
         $2 = $9;
         $9 = $2 - $10 | 0;
         $11 = $11 - (($2 >>> 0 < $10 >>> 0) + $7 | 0) | 0;
         if (($11 | 0) < 0) {
          $2 = HEAP32[$8 >> 2];
          $9 = $9 + 32 | 0;
          $11 = $9 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $7 = $9 & 31;
          if (($9 & 63) >>> 0 >= 32) {
           $5 = $2 << $7;
           $2 = 0;
          } else {
           $5 = (1 << $7) - 1 & $2 >>> 32 - $7;
           $2 = $2 << $7;
          }
          $2 = $2 + $6 | 0;
          $3 = $3 + $5 | 0;
          $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
          $8 = $8 + 4 | 0;
          $6 = $2;
         }
         $5 = $19;
         $7 = $21;
         $2 = $17 + 6400 | 0;
         $17 = HEAP32[$2 >> 2];
         $2 = $4 + HEAP32[$2 + 4 >> 2] | 0;
         $19 = $17 + $16 | 0;
         $16 = $19 >>> 0 < $16 >>> 0 ? $2 + 1 | 0 : $2;
        }
        $21 = $16;
        if (!(($14 | 0) == ($21 | 0) & $13 >>> 0 >= $19 >>> 0 | $14 >>> 0 > $21 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $6 = HEAP32[$1 + 40 >> 2];
         $3 = HEAP32[$1 + 44 >> 2];
         $1 = $12 - -64 | 0;
         HEAP32[$1 >> 2] = $19;
         HEAP32[$1 + 4 >> 2] = $21;
         HEAP32[$12 + 56 >> 2] = $6;
         HEAP32[$12 + 60 >> 2] = $3;
         HEAP32[$12 + 48 >> 2] = $13;
         HEAP32[$12 + 52 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $2 = 0 - $19 | 0;
        $16 = 0 - ((($19 | 0) != 0) + $21 | 0) | 0;
        $17 = $14 + $22 | 0;
        $4 = $13 + $18 | 0;
        $17 = $4 >>> 0 < $18 >>> 0 ? $17 + 1 | 0 : $17;
        $15 = $4 + 3 | 0;
        $10 = $15 >>> 0 < 3 ? $17 + 1 | 0 : $17;
        if (!(($20 | 0) == ($10 | 0) & $15 >>> 0 <= $25 >>> 0 | $10 >>> 0 < $20 >>> 0)) {
         $29 = 1;
         $30 = 0;
         break block8;
        }
        $17 = $2;
        $4 = $2 + $24 | 0;
        HEAP8[$13 + $24 | 0] = HEAPU8[$4 + $13 | 0];
        $2 = $13 + 1 | 0;
        HEAP8[$2 + $24 | 0] = HEAPU8[$2 + $4 | 0];
        $2 = $13 + 2 | 0;
        $16 = $2 >>> 0 < 2 ? $14 + 1 | 0 : $14;
        block38 : {
         if (!(($10 | 0) == ($16 | 0) & $2 >>> 0 < $15 >>> 0 | $10 >>> 0 > $16 >>> 0)) {
          $13 = $2;
          $14 = $16;
          break block38;
         }
         $4 = $18 + 1 & 3;
         if ($4) {
          $15 = 0;
          $10 = 0;
          $16 = 0 - $4 | 0;
          $4 = 0 - (($4 | 0) != 0) | 0;
          while (1) {
           HEAP8[$28 | 0] = HEAPU8[$17 + $28 | 0];
           $28 = $28 + 1 | 0;
           $2 = $10 - 1 | 0;
           $15 = $15 - 1 | 0;
           $10 = ($15 | 0) != -1 ? $2 + 1 | 0 : $2;
           if (($15 | 0) != ($16 | 0) | ($4 | 0) != ($10 | 0)) {
            continue
           }
           break;
          };
          $2 = $14 - (($15 >>> 0 > $13 >>> 0) + $10 | 0) | 0;
          $16 = $2 + 1 | 0;
          $4 = $2;
          $2 = ($13 - $15 | 0) + 2 | 0;
          $16 = $2 >>> 0 < 2 ? $16 : $4;
         }
         $4 = $22 + $31 | 0;
         $13 = $18 + $26 | 0;
         $14 = $13 >>> 0 < $26 >>> 0 ? $4 + 1 | 0 : $4;
         if (!$22 & $18 >>> 0 < 3) {
          break block38
         }
         $15 = $2 - $18 | 0;
         $10 = $16 - (($2 >>> 0 < $18 >>> 0) + $22 | 0) | 0;
         $4 = $2 + $24 | 0;
         while (1) {
          $2 = $4 + $17 | 0;
          HEAP8[$4 | 0] = HEAPU8[$2 | 0];
          HEAP8[$4 + 1 | 0] = HEAPU8[$2 + 1 | 0];
          HEAP8[$4 + 2 | 0] = HEAPU8[$2 + 2 | 0];
          HEAP8[$4 + 3 | 0] = HEAPU8[$2 + 3 | 0];
          $4 = $4 + 4 | 0;
          $15 = $15 + 4 | 0;
          $10 = $15 >>> 0 < 4 ? $10 + 1 | 0 : $10;
          if (($15 | 0) != ($26 | 0) | ($10 | 0) != ($31 | 0)) {
           continue
          }
          break;
         };
        }
        $29 = 1;
        $30 = 0;
        if (($14 | 0) == ($23 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $23 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block40;
     }
     wasm2js_trap();
    }
    $4 = $13 + $24 | 0;
    while (1) {
     HEAP8[$4 | 0] = HEAPU8[$2 + $4 | 0];
     $4 = $4 + 1 | 0;
     $13 = $13 + 1 | 0;
     $14 = $13 ? $14 : $14 + 1 | 0;
     if (($20 | 0) == ($14 | 0) & $13 >>> 0 < $25 >>> 0 | $14 >>> 0 < $20 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $2;
    HEAP32[$0 + 4 >> 2] = $16;
    HEAP32[$1 + 248 >> 2] = $15 - $25;
    HEAP32[$1 + 252 >> 2] = $10 - (($15 >>> 0 < $25 >>> 0) + $20 | 0);
   }
   HEAP32[$1 + 224 >> 2] = $5;
   HEAP32[$1 + 228 >> 2] = $7;
   HEAP32[$1 + 216 >> 2] = $19;
   HEAP32[$1 + 220 >> 2] = $21;
   HEAP32[$1 + 208 >> 2] = $29;
   HEAP32[$1 + 212 >> 2] = $30;
   HEAP32[$1 + 200 >> 2] = $8;
   HEAP32[$1 + 192 >> 2] = $9;
   HEAP32[$1 + 196 >> 2] = $11;
   HEAP32[$1 + 184 >> 2] = $6;
   HEAP32[$1 + 188 >> 2] = $3;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $14;
  }
  __stack_pointer = $12 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount2_Ptr4_Mtf2($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
  $12 = __stack_pointer - 272 | 0;
  __stack_pointer = $12;
  $5 = $1 - -64 | 0;
  $26 = HEAP32[$5 >> 2];
  $22 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $3 = $1 + 56 | 0;
  $27 = HEAP32[$3 >> 2];
  block2 : {
   block1 : {
    $14 = HEAP32[$5 + 4 >> 2];
    $2 = $14;
    $24 = HEAP32[$3 + 4 >> 2];
    $5 = $24;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $27 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($22 | 0) & $26 >>> 0 >= $27 >>> 0 | $5 >>> 0 < $22 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $12 + 40 | 0;
    HEAP32[$1 >> 2] = $26;
    HEAP32[$1 + 4 >> 2] = $22;
    $1 = $12 + 32 | 0;
    HEAP32[$1 >> 2] = $27;
    HEAP32[$1 + 4 >> 2] = $24;
    $1 = $12 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $14;
    HEAP32[$12 + 12 >> 2] = 42;
    HEAP32[$12 + 16 >> 2] = 0;
    HEAP32[$12 + 8 >> 2] = 3772;
    HEAP32[$12 + 4 >> 2] = 5217;
    HEAP32[$12 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 144 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 256 >> 2] = 2;
    $1 = $12 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 236 >> 2] = 50;
    HEAP32[$12 + 240 >> 2] = 0;
    HEAP32[$12 + 232 >> 2] = 3772;
    HEAP32[$12 + 228 >> 2] = 5217;
    HEAP32[$12 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 160 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 208 >> 2] = 2;
    $1 = $12 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 188 >> 2] = 58;
    HEAP32[$12 + 192 >> 2] = 0;
    HEAP32[$12 + 184 >> 2] = 3772;
    HEAP32[$12 + 180 >> 2] = 5217;
    HEAP32[$12 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 152 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 160 >> 2] = 4;
    $1 = $12 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 140 >> 2] = 66;
    HEAP32[$12 + 144 >> 2] = 0;
    HEAP32[$12 + 136 >> 2] = 3772;
    HEAP32[$12 + 132 >> 2] = 5217;
    HEAP32[$12 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $31 = HEAP32[$1 + 176 >> 2];
   $32 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 224 | 0;
   $2 = HEAP32[$5 >> 2];
   $6 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $19 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $17 = HEAP32[$5 >> 2];
   $20 = HEAP32[$5 + 4 >> 2];
   $25 = HEAP32[$1 + 264 >> 2];
   $8 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $10 = HEAP32[$5 >> 2];
   $11 = HEAP32[$5 + 4 >> 2];
   $3 = $1 + 184 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   $15 = $1 + 248 | 0;
   $4 = HEAP32[$15 >> 2];
   $15 = HEAP32[$15 + 4 >> 2];
   $16 = $15;
   block41 : {
    block8 : {
     block28 : {
      block9 : {
       if ($4 | $15) {
        $9 = $1 + 256 | 0;
        $7 = HEAP32[$9 >> 2];
        $15 = 0 - $7 | 0;
        $9 = HEAP32[$9 + 4 >> 2];
        $18 = 0 - ($9 + (($7 | 0) != 0) | 0) | 0;
        if (!(($18 | 0) == ($14 | 0) & $13 >>> 0 >= $15 >>> 0 | $14 >>> 0 > $18 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 + 112 | 0;
         HEAP32[$3 >> 2] = $15;
         HEAP32[$3 + 4 >> 2] = $18;
         HEAP32[$12 + 104 >> 2] = $5;
         HEAP32[$12 + 108 >> 2] = $1;
         HEAP32[$12 + 96 >> 2] = $13;
         HEAP32[$12 + 100 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $15 = $14 + $16 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (($22 | 0) == ($16 | 0) & $15 >>> 0 > $26 >>> 0 | $16 >>> 0 > $22 >>> 0) {
         break block8
        }
        $4 = $13 + $25 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
         $4 = $4 + 1 | 0;
         $13 = $13 + 1 | 0;
         $14 = $13 ? $14 : $14 + 1 | 0;
         if (($16 | 0) == ($14 | 0) & $13 >>> 0 < $15 >>> 0 | $14 >>> 0 < $16 >>> 0) {
          continue
         }
         break;
        };
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 >= $27 >>> 0 | $14 >>> 0 > $24 >>> 0) {
         break block9
        }
       }
       $33 = $25 + 2 | 0;
       while (1) {
        $15 = $2;
        $18 = $6;
        $28 = $13 + $33 | 0;
        block17 : {
         while (1) {
          $7 = HEAP16[(($5 & 4095) << 1) + $32 >> 1];
          $9 = $7 >> 31;
          block11 : {
           if (($7 | 0) >= 0) {
            $2 = $8;
            break block11;
           }
           $4 = $7 & 15;
           $2 = $4;
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
           $3 = $6;
           $2 = $10;
           $10 = $2 - $4 | 0;
           $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
           if (($11 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($11 | 0) < 0
           }
           block13 : {
            if (!$2) {
             $2 = $8;
             break block13;
            }
            $2 = $8 + 4 | 0;
            $4 = HEAP32[$8 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $8 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $4 << $8;
             $8 = 0;
            } else {
             $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
             $8 = $4 << $8;
            }
            $8 = $8 + $5 | 0;
            $3 = $3 + $6 | 0;
            $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
            $5 = $8;
           }
           $8 = (($7 & 2147483632) << 1) + $32 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) >= 0) {
            break block11
           }
           while (1) {
            $7 = $7 & 15;
            $6 = $3 >>> $7 | 0;
            $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
            $3 = $10;
            $10 = $3 - $7 | 0;
            $9 = $6;
            $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
            $6 = $9;
            block14 : {
             if (($11 | 0) >= 0) {
              break block14
             }
             $7 = HEAP32[$2 >> 2];
             $10 = $10 + 32 | 0;
             $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
             $3 = $10 & 31;
             if (($10 & 63) >>> 0 >= 32) {
              $6 = $7 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
              $3 = $7 << $3;
             }
             $3 = $3 + $5 | 0;
             $6 = $6 + $9 | 0;
             $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
             $5 = $3;
             $2 = $2 + 4 | 0;
            }
            $3 = $6;
            $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
            $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
            $7 = $4;
            $9 = $4 >> 31;
            if (($4 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $8 = $7 & 15;
          $6 = $3 >>> $8 | 0;
          $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
          $3 = $6;
          $6 = $10;
          $10 = $10 - $8 | 0;
          $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $6 = 1
          } else {
           $6 = ($11 | 0) < 0
          }
          block16 : {
           if (!$6) {
            $8 = $2;
            break block16;
           }
           $8 = $2 + 4 | 0;
           $4 = HEAP32[$2 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $21 = ($9 & 15) << 28 | $7 >>> 4;
          $29 = $9 >>> 4 | 0;
          if (!$9 & $7 >>> 0 > 4095 | $9) {
           break block17
          }
          HEAP8[$13 + $25 | 0] = $21;
          $28 = $28 + 1 | 0;
          $17 = 0;
          $20 = 0;
          $13 = $13 + 1 | 0;
          $14 = $13 ? $14 : $14 + 1 | 0;
          if (($24 | 0) == ($14 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
           continue
          }
          break;
         };
         $2 = $15;
         $6 = $18;
         break block9;
        }
        $7 = $21 & 15;
        if (($7 | 0) != 15) {
         $16 = 0
        } else {
         $7 = HEAP16[(($5 & 4095) << 1) + $31 >> 1];
         $9 = $7 >> 31;
         block20 : {
          if (($7 | 0) >= 0) {
           $2 = $8;
           break block20;
          }
          $4 = $7 & 15;
          $2 = $4;
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          $3 = $6;
          $2 = $10;
          $10 = $2 - $4 | 0;
          $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $8;
            break block22;
           }
           $2 = $8 + 4 | 0;
           $4 = HEAP32[$8 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $8 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $8;
            $8 = 0;
           } else {
            $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
            $8 = $4 << $8;
           }
           $8 = $8 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $8;
          }
          $8 = (($7 & 2147483632) << 1) + $31 | 0;
          $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
          $7 = $4;
          $9 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $7 = $7 & 15;
           $6 = $3 >>> $7 | 0;
           $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
           $3 = $10;
           $10 = $3 - $7 | 0;
           $9 = $6;
           $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
           $6 = $9;
           block23 : {
            if (($11 | 0) >= 0) {
             break block23
            }
            $7 = HEAP32[$2 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $3 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $7 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
             $3 = $7 << $3;
            }
            $3 = $3 + $5 | 0;
            $6 = $6 + $9 | 0;
            $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
            $5 = $3;
            $2 = $2 + 4 | 0;
           }
           $3 = $6;
           $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $8 = $7 & 15;
         $6 = $3 >>> $8 | 0;
         $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
         $3 = $6;
         $6 = $10;
         $10 = $10 - $8 | 0;
         $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
         if (($11 | 0) < -1) {
          $6 = 1
         } else {
          $6 = ($11 | 0) < 0
         }
         block25 : {
          if (!$6) {
           $4 = $2;
           break block25;
          }
          $4 = $2 + 4 | 0;
          $8 = HEAP32[$2 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $8 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
           $2 = $8 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $5 = $2;
         }
         $2 = ($9 & 15) << 28 | $7 >>> 4;
         $6 = $9 >>> 4 | 0;
         block27 : {
          if (!(!$9 & $7 >>> 0 >= 3712 | ($9 | 0) != 0)) {
           $8 = $4;
           break block27;
          }
          $6 = $6 - 1 | 0;
          $8 = $2 - 232 | 0;
          $9 = $8 >>> 0 < 4294967064 ? $6 + 1 | 0 : $6;
          if (!$9 & $8 >>> 0 >= 33 | $9) {
           break block28
          }
          $7 = $8 << 3;
          $2 = $7 + 6656 | 0;
          $16 = $5 & HEAP32[$2 >> 2];
          $30 = $3 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $3 >>> $2 | 0;
          } else {
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          }
          $3 = $6;
          $2 = $10;
          $10 = $2 - $8 | 0;
          $11 = $11 - (($2 >>> 0 < $8 >>> 0) + $9 | 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $8 = $4;
            break block30;
           }
           $8 = $4 + 4 | 0;
           $4 = HEAP32[$4 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $6 = $7 + 6400 | 0;
          $4 = HEAP32[$6 >> 2];
          $2 = $4 + $16 | 0;
          $6 = HEAP32[$6 + 4 >> 2] + $30 | 0;
          $6 = $2 >>> 0 < $4 >>> 0 ? $6 + 1 | 0 : $6;
          $2 = $2 + 231 | 0;
          $6 = $2 >>> 0 < 231 ? $6 + 1 | 0 : $6;
         }
         $7 = $2 + 15 | 0;
         $16 = $7 >>> 0 < 15 ? $6 + 1 | 0 : $6;
        }
        $2 = $29 - 1 | 0;
        $21 = $21 - 256 | 0;
        $9 = $21 >>> 0 < 4294967040 ? $2 + 1 | 0 : $2;
        block33 : {
         if (!(!$9 & $21 >>> 0 > 31 | ($9 | 0) != 0)) {
          $4 = $7 + 2 | 0;
          $29 = $4 >>> 0 < 2 ? $16 + 1 | 0 : $16;
          if ($17 | $20) {
           $2 = $19;
           $6 = $23;
           $19 = $15;
           if (!$9 & $21 >>> 0 < 16) {
            break block33
           }
           HEAP32[$0 >> 2] = 9;
           HEAP32[$12 + 80 >> 2] = $13;
           HEAP32[$12 + 84 >> 2] = $14;
           HEAP8[$0 + 16 | 0] = 0;
           break block2;
          }
          $9 = !$9 & $21 >>> 0 < 16;
          $2 = $9 ? $15 : $19;
          $6 = $9 ? $18 : $23;
          $19 = $9 ? $19 : $15;
          $18 = $9 ? $23 : $18;
          break block33;
         }
         $2 = ($9 >>> 4 | 0) - 1 | 0;
         $4 = (($9 & 15) << 28 | $21 >>> 4) - 2 | 0;
         $15 = $4 >>> 0 < 4294967294 ? $2 + 1 | 0 : $2;
         if (!$15 & $4 >>> 0 >= 33 | $15) {
          break block28
         }
         $18 = $4 << 3;
         $2 = $18 + 6656 | 0;
         $9 = $5 & HEAP32[$2 >> 2];
         $17 = $3 & HEAP32[$2 + 4 >> 2];
         $2 = $4 & 31;
         if (($4 & 63) >>> 0 >= 32) {
          $6 = 0;
          $5 = $3 >>> $2 | 0;
         } else {
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
         }
         $3 = $6;
         $2 = $10;
         $10 = $2 - $4 | 0;
         $11 = $11 - (($2 >>> 0 < $4 >>> 0) + $15 | 0) | 0;
         if (($11 | 0) < 0) {
          $4 = HEAP32[$8 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $4 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
           $2 = $4 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $8 = $8 + 4 | 0;
          $5 = $2;
         }
         $4 = $7 + 4 | 0;
         $29 = $4 >>> 0 < 4 ? $16 + 1 | 0 : $16;
         $2 = $19;
         $6 = $23;
         $19 = $18 + 6400 | 0;
         $15 = HEAP32[$19 >> 2];
         $19 = $17 + HEAP32[$19 + 4 >> 2] | 0;
         $18 = $19 + 1 | 0;
         $7 = $19;
         $19 = $9 + $15 | 0;
         $18 = $19 >>> 0 < $9 >>> 0 ? $18 : $7;
        }
        $23 = $18;
        if (!(($14 | 0) == ($23 | 0) & $13 >>> 0 >= $19 >>> 0 | $14 >>> 0 > $23 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 - -64 | 0;
         HEAP32[$3 >> 2] = $19;
         HEAP32[$3 + 4 >> 2] = $23;
         HEAP32[$12 + 56 >> 2] = $5;
         HEAP32[$12 + 60 >> 2] = $1;
         HEAP32[$12 + 48 >> 2] = $13;
         HEAP32[$12 + 52 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $7 = 0 - $19 | 0;
        $9 = 0 - ((($19 | 0) != 0) + $23 | 0) | 0;
        $15 = $14 + $29 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (!(($22 | 0) == ($16 | 0) & $15 >>> 0 <= $26 >>> 0 | $16 >>> 0 < $22 >>> 0)) {
         $17 = 1;
         $20 = 0;
         break block8;
        }
        $18 = $7;
        $9 = $7 + $25 | 0;
        HEAP8[$13 + $25 | 0] = HEAPU8[$9 + $13 | 0];
        $7 = $13 + 1 | 0;
        HEAP8[$7 + $25 | 0] = HEAPU8[$9 + $7 | 0];
        $17 = $13 + 2 | 0;
        $20 = $17 >>> 0 < 2 ? $14 + 1 | 0 : $14;
        block38 : {
         if (!(($16 | 0) == ($20 | 0) & $15 >>> 0 > $17 >>> 0 | $16 >>> 0 > $20 >>> 0)) {
          $13 = $17;
          $4 = $20;
          break block38;
         }
         $9 = $29 - 1 | 0;
         $30 = $4 - 3 | 0;
         $34 = $30 >>> 0 < 4294967293 ? $9 + 1 | 0 : $9;
         $21 = $4 & 3 ^ 2;
         if ($21) {
          $7 = 0;
          $9 = 0;
          $17 = 0 - $21 | 0;
          $20 = 0 - (($21 | 0) != 0) | 0;
          while (1) {
           HEAP8[$28 | 0] = HEAPU8[$18 + $28 | 0];
           $28 = $28 + 1 | 0;
           $9 = $9 - 1 | 0;
           $7 = $7 - 1 | 0;
           $9 = ($7 | 0) != -1 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($17 | 0) | ($9 | 0) != ($20 | 0)) {
            continue
           }
           break;
          };
          $9 = $14 - (($7 >>> 0 > $13 >>> 0) + $9 | 0) | 0;
          $17 = ($13 - $7 | 0) + 2 | 0;
          $20 = $17 >>> 0 < 2 ? $9 + 1 | 0 : $9;
         }
         if (!(!$34 & $30 >>> 0 < 3)) {
          $7 = $17 - $4 | 0;
          $9 = $20 - (($4 >>> 0 > $17 >>> 0) + $29 | 0) | 0;
          $4 = $17 + $25 | 0;
          while (1) {
           $17 = $4 + $18 | 0;
           HEAP8[$4 | 0] = HEAPU8[$17 | 0];
           HEAP8[$4 + 1 | 0] = HEAPU8[$17 + 1 | 0];
           HEAP8[$4 + 2 | 0] = HEAPU8[$17 + 2 | 0];
           HEAP8[$4 + 3 | 0] = HEAPU8[$17 + 3 | 0];
           $4 = $4 + 4 | 0;
           $7 = $7 + 4 | 0;
           $9 = $7 >>> 0 < 4 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($13 | 0) | ($9 | 0) != ($14 | 0)) {
            continue
           }
           break;
          };
         }
         $13 = $15;
         $4 = $16;
        }
        $14 = $4;
        $17 = 1;
        $20 = 0;
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block41;
     }
     wasm2js_trap();
    }
    $4 = $13 + $25 | 0;
    while (1) {
     HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
     $4 = $4 + 1 | 0;
     $13 = $13 + 1 | 0;
     $14 = $13 ? $14 : $14 + 1 | 0;
     if (($22 | 0) == ($14 | 0) & $13 >>> 0 < $26 >>> 0 | $14 >>> 0 < $22 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $7;
    HEAP32[$0 + 4 >> 2] = $9;
    HEAP32[$1 + 248 >> 2] = $15 - $26;
    HEAP32[$1 + 252 >> 2] = $16 - (($15 >>> 0 < $26 >>> 0) + $22 | 0);
   }
   HEAP32[$1 + 224 >> 2] = $2;
   HEAP32[$1 + 228 >> 2] = $6;
   HEAP32[$1 + 216 >> 2] = $19;
   HEAP32[$1 + 220 >> 2] = $23;
   HEAP32[$1 + 208 >> 2] = $17;
   HEAP32[$1 + 212 >> 2] = $20;
   HEAP32[$1 + 200 >> 2] = $8;
   HEAP32[$1 + 192 >> 2] = $10;
   HEAP32[$1 + 196 >> 2] = $11;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $3;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $14;
  }
  __stack_pointer = $12 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount2_Ptr4_Mtf3($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0;
  $12 = __stack_pointer - 272 | 0;
  __stack_pointer = $12;
  $5 = $1 - -64 | 0;
  $26 = HEAP32[$5 >> 2];
  $22 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $3 = $1 + 56 | 0;
  $27 = HEAP32[$3 >> 2];
  block2 : {
   block1 : {
    $14 = HEAP32[$5 + 4 >> 2];
    $2 = $14;
    $24 = HEAP32[$3 + 4 >> 2];
    $5 = $24;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $27 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($22 | 0) & $26 >>> 0 >= $27 >>> 0 | $5 >>> 0 < $22 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $12 + 40 | 0;
    HEAP32[$1 >> 2] = $26;
    HEAP32[$1 + 4 >> 2] = $22;
    $1 = $12 + 32 | 0;
    HEAP32[$1 >> 2] = $27;
    HEAP32[$1 + 4 >> 2] = $24;
    $1 = $12 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $14;
    HEAP32[$12 + 12 >> 2] = 42;
    HEAP32[$12 + 16 >> 2] = 0;
    HEAP32[$12 + 8 >> 2] = 3772;
    HEAP32[$12 + 4 >> 2] = 5028;
    HEAP32[$12 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 144 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 256 >> 2] = 2;
    $1 = $12 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 236 >> 2] = 50;
    HEAP32[$12 + 240 >> 2] = 0;
    HEAP32[$12 + 232 >> 2] = 3772;
    HEAP32[$12 + 228 >> 2] = 5028;
    HEAP32[$12 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 160 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 208 >> 2] = 3;
    $1 = $12 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 188 >> 2] = 58;
    HEAP32[$12 + 192 >> 2] = 0;
    HEAP32[$12 + 184 >> 2] = 3772;
    HEAP32[$12 + 180 >> 2] = 5028;
    HEAP32[$12 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $3 = $1 + 152 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   if (!(!$3 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$12 + 160 >> 2] = 4;
    $1 = $12 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $3;
    HEAP32[$12 + 140 >> 2] = 66;
    HEAP32[$12 + 144 >> 2] = 0;
    HEAP32[$12 + 136 >> 2] = 3772;
    HEAP32[$12 + 132 >> 2] = 5028;
    HEAP32[$12 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $31 = HEAP32[$1 + 176 >> 2];
   $32 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 224 | 0;
   $2 = HEAP32[$5 >> 2];
   $6 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $19 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $17 = HEAP32[$5 >> 2];
   $20 = HEAP32[$5 + 4 >> 2];
   $25 = HEAP32[$1 + 264 >> 2];
   $8 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $10 = HEAP32[$5 >> 2];
   $11 = HEAP32[$5 + 4 >> 2];
   $3 = $1 + 184 | 0;
   $5 = HEAP32[$3 >> 2];
   $3 = HEAP32[$3 + 4 >> 2];
   $15 = $1 + 248 | 0;
   $4 = HEAP32[$15 >> 2];
   $15 = HEAP32[$15 + 4 >> 2];
   $16 = $15;
   block41 : {
    block8 : {
     block28 : {
      block9 : {
       if ($4 | $15) {
        $9 = $1 + 256 | 0;
        $7 = HEAP32[$9 >> 2];
        $15 = 0 - $7 | 0;
        $9 = HEAP32[$9 + 4 >> 2];
        $18 = 0 - ($9 + (($7 | 0) != 0) | 0) | 0;
        if (!(($18 | 0) == ($14 | 0) & $13 >>> 0 >= $15 >>> 0 | $14 >>> 0 > $18 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 + 112 | 0;
         HEAP32[$3 >> 2] = $15;
         HEAP32[$3 + 4 >> 2] = $18;
         HEAP32[$12 + 104 >> 2] = $5;
         HEAP32[$12 + 108 >> 2] = $1;
         HEAP32[$12 + 96 >> 2] = $13;
         HEAP32[$12 + 100 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $15 = $14 + $16 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (($22 | 0) == ($16 | 0) & $15 >>> 0 > $26 >>> 0 | $16 >>> 0 > $22 >>> 0) {
         break block8
        }
        $4 = $13 + $25 | 0;
        while (1) {
         HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
         $4 = $4 + 1 | 0;
         $13 = $13 + 1 | 0;
         $14 = $13 ? $14 : $14 + 1 | 0;
         if (($16 | 0) == ($14 | 0) & $13 >>> 0 < $15 >>> 0 | $14 >>> 0 < $16 >>> 0) {
          continue
         }
         break;
        };
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 >= $27 >>> 0 | $14 >>> 0 > $24 >>> 0) {
         break block9
        }
       }
       $33 = $25 + 2 | 0;
       while (1) {
        $15 = $2;
        $18 = $6;
        $28 = $13 + $33 | 0;
        block17 : {
         while (1) {
          $7 = HEAP16[(($5 & 4095) << 1) + $32 >> 1];
          $9 = $7 >> 31;
          block11 : {
           if (($7 | 0) >= 0) {
            $2 = $8;
            break block11;
           }
           $4 = $7 & 15;
           $2 = $4;
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
           $3 = $6;
           $2 = $10;
           $10 = $2 - $4 | 0;
           $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
           if (($11 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($11 | 0) < 0
           }
           block13 : {
            if (!$2) {
             $2 = $8;
             break block13;
            }
            $2 = $8 + 4 | 0;
            $4 = HEAP32[$8 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $8 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $4 << $8;
             $8 = 0;
            } else {
             $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
             $8 = $4 << $8;
            }
            $8 = $8 + $5 | 0;
            $3 = $3 + $6 | 0;
            $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
            $5 = $8;
           }
           $8 = (($7 & 2147483632) << 1) + $32 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) >= 0) {
            break block11
           }
           while (1) {
            $7 = $7 & 15;
            $6 = $3 >>> $7 | 0;
            $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
            $3 = $10;
            $10 = $3 - $7 | 0;
            $9 = $6;
            $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
            $6 = $9;
            block14 : {
             if (($11 | 0) >= 0) {
              break block14
             }
             $7 = HEAP32[$2 >> 2];
             $10 = $10 + 32 | 0;
             $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
             $3 = $10 & 31;
             if (($10 & 63) >>> 0 >= 32) {
              $6 = $7 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
              $3 = $7 << $3;
             }
             $3 = $3 + $5 | 0;
             $6 = $6 + $9 | 0;
             $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
             $5 = $3;
             $2 = $2 + 4 | 0;
            }
            $3 = $6;
            $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
            $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
            $7 = $4;
            $9 = $4 >> 31;
            if (($4 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $8 = $7 & 15;
          $6 = $3 >>> $8 | 0;
          $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
          $3 = $6;
          $6 = $10;
          $10 = $10 - $8 | 0;
          $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $6 = 1
          } else {
           $6 = ($11 | 0) < 0
          }
          block16 : {
           if (!$6) {
            $8 = $2;
            break block16;
           }
           $8 = $2 + 4 | 0;
           $4 = HEAP32[$2 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $21 = ($9 & 15) << 28 | $7 >>> 4;
          $29 = $9 >>> 4 | 0;
          if (!$9 & $7 >>> 0 > 4095 | $9) {
           break block17
          }
          HEAP8[$13 + $25 | 0] = $21;
          $28 = $28 + 1 | 0;
          $17 = 0;
          $20 = 0;
          $13 = $13 + 1 | 0;
          $14 = $13 ? $14 : $14 + 1 | 0;
          if (($24 | 0) == ($14 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
           continue
          }
          break;
         };
         $2 = $15;
         $6 = $18;
         break block9;
        }
        $7 = $21 & 15;
        if (($7 | 0) != 15) {
         $16 = 0
        } else {
         $7 = HEAP16[(($5 & 4095) << 1) + $31 >> 1];
         $9 = $7 >> 31;
         block20 : {
          if (($7 | 0) >= 0) {
           $2 = $8;
           break block20;
          }
          $4 = $7 & 15;
          $2 = $4;
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          $3 = $6;
          $2 = $10;
          $10 = $2 - $4 | 0;
          $11 = $11 - ($2 >>> 0 < $4 >>> 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block22 : {
           if (!$2) {
            $2 = $8;
            break block22;
           }
           $2 = $8 + 4 | 0;
           $4 = HEAP32[$8 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $8 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $8;
            $8 = 0;
           } else {
            $6 = (1 << $8) - 1 & $4 >>> 32 - $8;
            $8 = $4 << $8;
           }
           $8 = $8 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $5 >>> 0 > $8 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $8;
          }
          $8 = (($7 & 2147483632) << 1) + $31 | 0;
          $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
          $7 = $4;
          $9 = $4 >> 31;
          if (($4 | 0) >= 0) {
           break block20
          }
          while (1) {
           $7 = $7 & 15;
           $6 = $3 >>> $7 | 0;
           $5 = ((1 << $7) - 1 & $3) << 32 - $7 | $5 >>> $7;
           $3 = $10;
           $10 = $3 - $7 | 0;
           $9 = $6;
           $11 = $11 - ($3 >>> 0 < $7 >>> 0) | 0;
           $6 = $9;
           block23 : {
            if (($11 | 0) >= 0) {
             break block23
            }
            $7 = HEAP32[$2 >> 2];
            $10 = $10 + 32 | 0;
            $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
            $3 = $10 & 31;
            if (($10 & 63) >>> 0 >= 32) {
             $6 = $7 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $7 >>> 32 - $3;
             $3 = $7 << $3;
            }
            $3 = $3 + $5 | 0;
            $6 = $6 + $9 | 0;
            $6 = $3 >>> 0 < $5 >>> 0 ? $6 + 1 | 0 : $6;
            $5 = $3;
            $2 = $2 + 4 | 0;
           }
           $3 = $6;
           $8 = (($4 & 65520) << 16 >> 16 << 1) + $8 | 0;
           $4 = HEAP16[$8 + (($5 & 63) << 1) >> 1];
           $7 = $4;
           $9 = $4 >> 31;
           if (($4 | 0) < 0) {
            continue
           }
           break;
          };
         }
         $8 = $7 & 15;
         $6 = $3 >>> $8 | 0;
         $5 = ((1 << $8) - 1 & $3) << 32 - $8 | $5 >>> $8;
         $3 = $6;
         $6 = $10;
         $10 = $10 - $8 | 0;
         $11 = $11 - ($6 >>> 0 < $8 >>> 0) | 0;
         if (($11 | 0) < -1) {
          $6 = 1
         } else {
          $6 = ($11 | 0) < 0
         }
         block25 : {
          if (!$6) {
           $4 = $2;
           break block25;
          }
          $4 = $2 + 4 | 0;
          $8 = HEAP32[$2 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $8 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
           $2 = $8 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $5 = $2;
         }
         $2 = ($9 & 15) << 28 | $7 >>> 4;
         $6 = $9 >>> 4 | 0;
         block27 : {
          if (!(!$9 & $7 >>> 0 >= 3712 | ($9 | 0) != 0)) {
           $8 = $4;
           break block27;
          }
          $6 = $6 - 1 | 0;
          $8 = $2 - 232 | 0;
          $9 = $8 >>> 0 < 4294967064 ? $6 + 1 | 0 : $6;
          if (!$9 & $8 >>> 0 >= 33 | $9) {
           break block28
          }
          $7 = $8 << 3;
          $2 = $7 + 6656 | 0;
          $16 = $5 & HEAP32[$2 >> 2];
          $30 = $3 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $3 >>> $2 | 0;
          } else {
           $6 = $3 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
          }
          $3 = $6;
          $2 = $10;
          $10 = $2 - $8 | 0;
          $11 = $11 - (($2 >>> 0 < $8 >>> 0) + $9 | 0) | 0;
          if (($11 | 0) < -1) {
           $2 = 1
          } else {
           $2 = ($11 | 0) < 0
          }
          block30 : {
           if (!$2) {
            $8 = $4;
            break block30;
           }
           $8 = $4 + 4 | 0;
           $4 = HEAP32[$4 >> 2];
           $10 = $10 + 32 | 0;
           $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
           $2 = $10 & 31;
           if (($10 & 63) >>> 0 >= 32) {
            $6 = $4 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
            $2 = $4 << $2;
           }
           $2 = $2 + $5 | 0;
           $3 = $3 + $6 | 0;
           $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
           $5 = $2;
          }
          $6 = $7 + 6400 | 0;
          $4 = HEAP32[$6 >> 2];
          $2 = $4 + $16 | 0;
          $6 = HEAP32[$6 + 4 >> 2] + $30 | 0;
          $6 = $2 >>> 0 < $4 >>> 0 ? $6 + 1 | 0 : $6;
          $2 = $2 + 231 | 0;
          $6 = $2 >>> 0 < 231 ? $6 + 1 | 0 : $6;
         }
         $7 = $2 + 15 | 0;
         $16 = $7 >>> 0 < 15 ? $6 + 1 | 0 : $6;
        }
        $2 = $29 - 1 | 0;
        $21 = $21 - 256 | 0;
        $9 = $21 >>> 0 < 4294967040 ? $2 + 1 | 0 : $2;
        block33 : {
         if (!(!$9 & $21 >>> 0 > 31 | ($9 | 0) != 0)) {
          $4 = $7 + 3 | 0;
          $29 = $4 >>> 0 < 3 ? $16 + 1 | 0 : $16;
          if ($17 | $20) {
           $2 = $19;
           $6 = $23;
           $19 = $15;
           if (!$9 & $21 >>> 0 < 16) {
            break block33
           }
           HEAP32[$0 >> 2] = 9;
           HEAP32[$12 + 80 >> 2] = $13;
           HEAP32[$12 + 84 >> 2] = $14;
           HEAP8[$0 + 16 | 0] = 0;
           break block2;
          }
          $9 = !$9 & $21 >>> 0 < 16;
          $2 = $9 ? $15 : $19;
          $6 = $9 ? $18 : $23;
          $19 = $9 ? $19 : $15;
          $18 = $9 ? $23 : $18;
          break block33;
         }
         $2 = ($9 >>> 4 | 0) - 1 | 0;
         $4 = (($9 & 15) << 28 | $21 >>> 4) - 2 | 0;
         $15 = $4 >>> 0 < 4294967294 ? $2 + 1 | 0 : $2;
         if (!$15 & $4 >>> 0 >= 33 | $15) {
          break block28
         }
         $18 = $4 << 3;
         $2 = $18 + 6656 | 0;
         $9 = $5 & HEAP32[$2 >> 2];
         $17 = $3 & HEAP32[$2 + 4 >> 2];
         $2 = $4 & 31;
         if (($4 & 63) >>> 0 >= 32) {
          $6 = 0;
          $5 = $3 >>> $2 | 0;
         } else {
          $6 = $3 >>> $2 | 0;
          $5 = ((1 << $2) - 1 & $3) << 32 - $2 | $5 >>> $2;
         }
         $3 = $6;
         $2 = $10;
         $10 = $2 - $4 | 0;
         $11 = $11 - (($2 >>> 0 < $4 >>> 0) + $15 | 0) | 0;
         if (($11 | 0) < 0) {
          $4 = HEAP32[$8 >> 2];
          $10 = $10 + 32 | 0;
          $11 = $10 >>> 0 < 32 ? $11 + 1 | 0 : $11;
          $2 = $10 & 31;
          if (($10 & 63) >>> 0 >= 32) {
           $6 = $4 << $2;
           $2 = 0;
          } else {
           $6 = (1 << $2) - 1 & $4 >>> 32 - $2;
           $2 = $4 << $2;
          }
          $2 = $2 + $5 | 0;
          $3 = $3 + $6 | 0;
          $3 = $2 >>> 0 < $5 >>> 0 ? $3 + 1 | 0 : $3;
          $8 = $8 + 4 | 0;
          $5 = $2;
         }
         $4 = $7 + 4 | 0;
         $29 = $4 >>> 0 < 4 ? $16 + 1 | 0 : $16;
         $2 = $19;
         $6 = $23;
         $19 = $18 + 6400 | 0;
         $15 = HEAP32[$19 >> 2];
         $19 = $17 + HEAP32[$19 + 4 >> 2] | 0;
         $18 = $19 + 1 | 0;
         $7 = $19;
         $19 = $9 + $15 | 0;
         $18 = $19 >>> 0 < $9 >>> 0 ? $18 : $7;
        }
        $23 = $18;
        if (!(($14 | 0) == ($23 | 0) & $13 >>> 0 >= $19 >>> 0 | $14 >>> 0 > $23 >>> 0)) {
         HEAP32[$0 >> 2] = 9;
         $5 = HEAP32[$1 + 40 >> 2];
         $1 = HEAP32[$1 + 44 >> 2];
         $3 = $12 - -64 | 0;
         HEAP32[$3 >> 2] = $19;
         HEAP32[$3 + 4 >> 2] = $23;
         HEAP32[$12 + 56 >> 2] = $5;
         HEAP32[$12 + 60 >> 2] = $1;
         HEAP32[$12 + 48 >> 2] = $13;
         HEAP32[$12 + 52 >> 2] = $14;
         HEAP8[$0 + 16 | 0] = 0;
         break block2;
        }
        $7 = 0 - $19 | 0;
        $9 = 0 - ((($19 | 0) != 0) + $23 | 0) | 0;
        $15 = $14 + $29 | 0;
        $16 = $15 + 1 | 0;
        $18 = $15;
        $15 = $4 + $13 | 0;
        $16 = $15 >>> 0 < $13 >>> 0 ? $16 : $18;
        if (!(($22 | 0) == ($16 | 0) & $15 >>> 0 <= $26 >>> 0 | $16 >>> 0 < $22 >>> 0)) {
         $17 = 1;
         $20 = 0;
         break block8;
        }
        $18 = $7;
        $9 = $7 + $25 | 0;
        HEAP8[$13 + $25 | 0] = HEAPU8[$9 + $13 | 0];
        $7 = $13 + 1 | 0;
        HEAP8[$7 + $25 | 0] = HEAPU8[$9 + $7 | 0];
        $17 = $13 + 2 | 0;
        $20 = $17 >>> 0 < 2 ? $14 + 1 | 0 : $14;
        block38 : {
         if (!(($16 | 0) == ($20 | 0) & $15 >>> 0 > $17 >>> 0 | $16 >>> 0 > $20 >>> 0)) {
          $13 = $17;
          $4 = $20;
          break block38;
         }
         $9 = $29 - 1 | 0;
         $30 = $4 - 3 | 0;
         $34 = $30 >>> 0 < 4294967293 ? $9 + 1 | 0 : $9;
         $21 = $4 & 3 ^ 2;
         if ($21) {
          $7 = 0;
          $9 = 0;
          $17 = 0 - $21 | 0;
          $20 = 0 - (($21 | 0) != 0) | 0;
          while (1) {
           HEAP8[$28 | 0] = HEAPU8[$18 + $28 | 0];
           $28 = $28 + 1 | 0;
           $9 = $9 - 1 | 0;
           $7 = $7 - 1 | 0;
           $9 = ($7 | 0) != -1 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($17 | 0) | ($9 | 0) != ($20 | 0)) {
            continue
           }
           break;
          };
          $9 = $14 - (($7 >>> 0 > $13 >>> 0) + $9 | 0) | 0;
          $17 = ($13 - $7 | 0) + 2 | 0;
          $20 = $17 >>> 0 < 2 ? $9 + 1 | 0 : $9;
         }
         if (!(!$34 & $30 >>> 0 < 3)) {
          $7 = $17 - $4 | 0;
          $9 = $20 - (($4 >>> 0 > $17 >>> 0) + $29 | 0) | 0;
          $4 = $17 + $25 | 0;
          while (1) {
           $17 = $4 + $18 | 0;
           HEAP8[$4 | 0] = HEAPU8[$17 | 0];
           HEAP8[$4 + 1 | 0] = HEAPU8[$17 + 1 | 0];
           HEAP8[$4 + 2 | 0] = HEAPU8[$17 + 2 | 0];
           HEAP8[$4 + 3 | 0] = HEAPU8[$17 + 3 | 0];
           $4 = $4 + 4 | 0;
           $7 = $7 + 4 | 0;
           $9 = $7 >>> 0 < 4 ? $9 + 1 | 0 : $9;
           if (($7 | 0) != ($13 | 0) | ($9 | 0) != ($14 | 0)) {
            continue
           }
           break;
          };
         }
         $13 = $15;
         $4 = $16;
        }
        $14 = $4;
        $17 = 1;
        $20 = 0;
        if (($14 | 0) == ($24 | 0) & $13 >>> 0 < $27 >>> 0 | $14 >>> 0 < $24 >>> 0) {
         continue
        }
        break;
       };
      }
      HEAP32[$1 + 248 >> 2] = 0;
      HEAP32[$1 + 252 >> 2] = 0;
      break block41;
     }
     wasm2js_trap();
    }
    $4 = $13 + $25 | 0;
    while (1) {
     HEAP8[$4 | 0] = HEAPU8[$4 + $7 | 0];
     $4 = $4 + 1 | 0;
     $13 = $13 + 1 | 0;
     $14 = $13 ? $14 : $14 + 1 | 0;
     if (($22 | 0) == ($14 | 0) & $13 >>> 0 < $26 >>> 0 | $14 >>> 0 < $22 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $7;
    HEAP32[$0 + 4 >> 2] = $9;
    HEAP32[$1 + 248 >> 2] = $15 - $26;
    HEAP32[$1 + 252 >> 2] = $16 - (($15 >>> 0 < $26 >>> 0) + $22 | 0);
   }
   HEAP32[$1 + 224 >> 2] = $2;
   HEAP32[$1 + 228 >> 2] = $6;
   HEAP32[$1 + 216 >> 2] = $19;
   HEAP32[$1 + 220 >> 2] = $23;
   HEAP32[$1 + 208 >> 2] = $17;
   HEAP32[$1 + 212 >> 2] = $20;
   HEAP32[$1 + 200 >> 2] = $8;
   HEAP32[$1 + 192 >> 2] = $10;
   HEAP32[$1 + 196 >> 2] = $11;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $3;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $14;
  }
  __stack_pointer = $12 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount4_Ptr3_Mtf2($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0;
  $11 = __stack_pointer - 272 | 0;
  __stack_pointer = $11;
  $5 = $1 - -64 | 0;
  $35 = HEAP32[$5 >> 2];
  $28 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $4 = $1 + 56 | 0;
  $36 = HEAP32[$4 >> 2];
  block2 : {
   block1 : {
    $16 = HEAP32[$5 + 4 >> 2];
    $2 = $16;
    $32 = HEAP32[$4 + 4 >> 2];
    $5 = $32;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $36 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($28 | 0) & $35 >>> 0 >= $36 >>> 0 | $5 >>> 0 < $28 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $11 + 40 | 0;
    HEAP32[$1 >> 2] = $35;
    HEAP32[$1 + 4 >> 2] = $28;
    $1 = $11 + 32 | 0;
    HEAP32[$1 >> 2] = $36;
    HEAP32[$1 + 4 >> 2] = $32;
    $1 = $11 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $16;
    HEAP32[$11 + 12 >> 2] = 42;
    HEAP32[$11 + 16 >> 2] = 0;
    HEAP32[$11 + 8 >> 2] = 3772;
    HEAP32[$11 + 4 >> 2] = 5252;
    HEAP32[$11 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 144 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 256 >> 2] = 4;
    $1 = $11 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 236 >> 2] = 50;
    HEAP32[$11 + 240 >> 2] = 0;
    HEAP32[$11 + 232 >> 2] = 3772;
    HEAP32[$11 + 228 >> 2] = 5252;
    HEAP32[$11 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 160 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 208 >> 2] = 2;
    $1 = $11 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 188 >> 2] = 58;
    HEAP32[$11 + 192 >> 2] = 0;
    HEAP32[$11 + 184 >> 2] = 3772;
    HEAP32[$11 + 180 >> 2] = 5252;
    HEAP32[$11 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 152 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 160 >> 2] = 3;
    $1 = $11 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 140 >> 2] = 66;
    HEAP32[$11 + 144 >> 2] = 0;
    HEAP32[$11 + 136 >> 2] = 3772;
    HEAP32[$11 + 132 >> 2] = 5252;
    HEAP32[$11 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $38 = HEAP32[$1 + 176 >> 2];
   $39 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 240 | 0;
   $12 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 232 | 0;
   $6 = HEAP32[$5 >> 2];
   $8 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 224 | 0;
   $22 = HEAP32[$5 >> 2];
   $24 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $3 = HEAP32[$5 >> 2];
   $2 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $25 = HEAP32[$5 >> 2];
   $27 = HEAP32[$5 + 4 >> 2];
   $33 = HEAP32[$1 + 264 >> 2];
   $18 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $7 = HEAP32[$5 >> 2];
   $9 = HEAP32[$5 + 4 >> 2];
   $4 = $1 + 184 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   $21 = $1 + 248 | 0;
   $20 = HEAP32[$21 >> 2];
   $21 = HEAP32[$21 + 4 >> 2];
   $17 = $21;
   block47 : {
    block8 : {
     block28 : {
      block35 : {
       block9 : {
        if ($20 | $17) {
         $19 = $1 + 256 | 0;
         $10 = HEAP32[$19 >> 2];
         $21 = 0 - $10 | 0;
         $15 = HEAP32[$19 + 4 >> 2];
         $19 = 0 - ($15 + (($10 | 0) != 0) | 0) | 0;
         if (!(($19 | 0) == ($16 | 0) & $13 >>> 0 >= $21 >>> 0 | $16 >>> 0 > $19 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 + 112 | 0;
          HEAP32[$4 >> 2] = $21;
          HEAP32[$4 + 4 >> 2] = $19;
          HEAP32[$11 + 104 >> 2] = $5;
          HEAP32[$11 + 108 >> 2] = $1;
          HEAP32[$11 + 96 >> 2] = $13;
          HEAP32[$11 + 100 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $21 = $16 + $17 | 0;
         $20 = $13 + $20 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $21 + 1 | 0 : $21;
         if (($28 | 0) == ($19 | 0) & $20 >>> 0 > $35 >>> 0 | $19 >>> 0 > $28 >>> 0) {
          break block8
         }
         $14 = $13 + $33 | 0;
         while (1) {
          HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
          $14 = $14 + 1 | 0;
          $13 = $13 + 1 | 0;
          $16 = $13 ? $16 : $16 + 1 | 0;
          if (($19 | 0) == ($16 | 0) & $13 >>> 0 < $20 >>> 0 | $16 >>> 0 < $19 >>> 0) {
           continue
          }
          break;
         };
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 >= $36 >>> 0 | $16 >>> 0 > $32 >>> 0) {
          break block9
         }
        }
        $40 = $33 + 2 | 0;
        while (1) {
         $19 = $3;
         $17 = $2;
         $26 = $22;
         $30 = $24;
         $20 = $6;
         $21 = $8;
         $29 = $12;
         $31 = $23;
         $37 = $13 + $40 | 0;
         block17 : {
          while (1) {
           $12 = HEAP16[(($5 & 4095) << 1) + $39 >> 1];
           $10 = $12;
           $15 = $10 >> 31;
           block11 : {
            if (($10 | 0) >= 0) {
             $2 = $18;
             break block11;
            }
            $3 = $10 & 15;
            $2 = $3;
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
            $4 = $6;
            $2 = $7;
            $7 = $2 - $3 | 0;
            $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
            $9 = $2;
            block13 : {
             if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
              $2 = $18;
              break block13;
             }
             $2 = $18 + 4 | 0;
             $8 = HEAP32[$18 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $8 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
              $3 = $8 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $5 = $3;
            }
            $18 = (($12 & 2147483632) << 1) + $39 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) >= 0) {
             break block11
            }
            while (1) {
             $8 = $10 & 15;
             $3 = $8;
             $6 = $4 >>> $3 | 0;
             $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
             $4 = $6;
             $3 = $7;
             $7 = $3 - $8 | 0;
             $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
             if (($9 | 0) < 0) {
              $8 = HEAP32[$2 >> 2];
              $7 = $7 + 32 | 0;
              $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
              $3 = $7 & 31;
              if (($7 & 63) >>> 0 >= 32) {
               $6 = $8 << $3;
               $3 = 0;
              } else {
               $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
               $3 = $8 << $3;
              }
              $3 = $3 + $5 | 0;
              $4 = $4 + $6 | 0;
              $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
              $2 = $2 + 4 | 0;
              $5 = $3;
             }
             $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
             $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
             $10 = $14;
             $15 = $10 >> 31;
             if (($10 | 0) < 0) {
              continue
             }
             break;
            };
           }
           $8 = $10 & 15;
           $3 = $8;
           $6 = $4 >>> $3 | 0;
           $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
           $4 = $6;
           $3 = $7;
           $7 = $3 - $8 | 0;
           $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
           if (($9 | 0) < -1) {
            $3 = 1
           } else {
            $3 = ($9 | 0) < 0
           }
           block16 : {
            if (!$3) {
             $18 = $2;
             break block16;
            }
            $18 = $2 + 4 | 0;
            $3 = HEAP32[$2 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $8 = ($15 & 15) << 28 | $10 >>> 4;
           $23 = $15 >>> 4 | 0;
           if (!$15 & $10 >>> 0 > 4095 | $15) {
            break block17
           }
           HEAP8[$13 + $33 | 0] = $8;
           $37 = $37 + 1 | 0;
           $25 = 0;
           $27 = 0;
           $13 = $13 + 1 | 0;
           $16 = $13 ? $16 : $16 + 1 | 0;
           if (($32 | 0) == ($16 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
            continue
           }
           break;
          };
          $12 = $29;
          $23 = $31;
          $6 = $20;
          $8 = $21;
          $22 = $26;
          $24 = $30;
          $3 = $19;
          $2 = $17;
          break block9;
         }
         $3 = $8 & 15;
         if (($3 | 0) != 15) {
          $12 = 0
         } else {
          $22 = HEAP16[(($5 & 4095) << 1) + $38 >> 1];
          $10 = $22;
          $15 = $10 >> 31;
          block20 : {
           if (($10 | 0) >= 0) {
            $2 = $18;
            break block20;
           }
           $3 = $10 & 15;
           $2 = $3;
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
           $9 = $2;
           block22 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $2 = $18;
             break block22;
            }
            $2 = $18 + 4 | 0;
            $12 = HEAP32[$18 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $3 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $12 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
             $3 = $12 << $3;
            }
            $3 = $3 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $3;
           }
           $18 = (($22 & 2147483632) << 1) + $38 | 0;
           $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
           $10 = $14;
           $15 = $10 >> 31;
           if (($10 | 0) >= 0) {
            break block20
           }
           while (1) {
            $12 = $10 & 15;
            $3 = $12;
            $6 = $4 >>> $3 | 0;
            $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
            $4 = $6;
            $3 = $7;
            $7 = $3 - $12 | 0;
            $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
            if (($9 | 0) < 0) {
             $12 = HEAP32[$2 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $12 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
              $3 = $12 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $2 = $2 + 4 | 0;
             $5 = $3;
            }
            $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $12 = $10 & 15;
          $3 = $12;
          $6 = $4 >>> $3 | 0;
          $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
          $4 = $6;
          $3 = $7;
          $7 = $3 - $12 | 0;
          $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $3 = 1
          } else {
           $3 = ($9 | 0) < 0
          }
          block25 : {
           if (!$3) {
            $14 = $2;
            break block25;
           }
           $14 = $2 + 4 | 0;
           $3 = HEAP32[$2 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $3 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $2 = $3 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $5 = $2;
          }
          $3 = ($15 & 15) << 28 | $10 >>> 4;
          $2 = $15 >>> 4 | 0;
          block27 : {
           if (!(!$15 & $10 >>> 0 >= 3712 | ($15 | 0) != 0)) {
            $18 = $14;
            break block27;
           }
           $2 = $2 - 1 | 0;
           $3 = $3 - 232 | 0;
           $12 = $3 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
           if (!$12 & $3 >>> 0 >= 33 | $12) {
            break block28
           }
           $22 = $3 << 3;
           $2 = $22 + 6656 | 0;
           $24 = $5 & HEAP32[$2 >> 2];
           $15 = $4 & HEAP32[$2 + 4 >> 2];
           $2 = $3 & 31;
           if (($3 & 63) >>> 0 >= 32) {
            $6 = 0;
            $5 = $4 >>> $2 | 0;
           } else {
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           }
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - (($2 >>> 0 < $3 >>> 0) + $12 | 0) | 0;
           $9 = $2;
           block30 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $18 = $14;
             break block30;
            }
            $18 = $14 + 4 | 0;
            $3 = HEAP32[$14 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $3 = $22 + 6400 | 0;
           $6 = HEAP32[$3 >> 2];
           $2 = $6 + $24 | 0;
           $3 = HEAP32[$3 + 4 >> 2] + $15 | 0;
           $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
           $12 = $3 + 1 | 0;
           $6 = $3;
           $3 = $2 + 231 | 0;
           $2 = $3 >>> 0 < 231 ? $12 : $6;
          }
          $3 = $3 + 15 | 0;
          $12 = $3 >>> 0 < 15 ? $2 + 1 | 0 : $2;
         }
         $2 = $23 - 1 | 0;
         $22 = $2 + 1 | 0;
         $6 = $2;
         $2 = $8 - 256 | 0;
         $8 = $2 >>> 0 < 4294967040 ? $22 : $6;
         $6 = $8 >>> 4 | 0;
         $23 = ($8 & 15) << 28 | $2 >>> 4;
         $24 = ($8 | 0) != 0;
         $22 = !$8;
         block34 : {
          if (!($24 | $22 & $2 >>> 0 > 63)) {
           $34 = $3 + 2 | 0;
           $14 = $34 >>> 0 < 2 ? $12 + 1 | 0 : $12;
           block38 : {
            block36 : {
             if ($25 | $27) {
              if (!($24 | $2 >>> 0 >= 16 & $22)) {
               $12 = $29;
               $23 = $31;
               $6 = $20;
               $8 = $21;
               $22 = $19;
               $24 = $17;
               $3 = $26;
               $2 = $30;
               break block34;
              }
              $2 = $6 - 1 | 0;
              $15 = $23 - 1 | 0;
              $2 = ($15 | 0) != -1 ? $2 + 1 | 0 : $2;
              if (!$2 & $15 >>> 0 > 1 | $2) {
               break block35
              }
              $12 = $29;
              $23 = $31;
              $6 = $26;
              $8 = $30;
              $22 = $19;
              $24 = $17;
              $3 = $20;
              $2 = $21;
              if ($15 - 1 | 0) {
               break block34
              }
              break block36;
             }
             if (!(!$8 & $2 >>> 0 >= 16 | ($8 | 0) != 0)) {
              $12 = $29;
              $23 = $31;
              $6 = $20;
              $8 = $21;
              $22 = $26;
              $24 = $30;
              $3 = $19;
              $2 = $17;
              break block34;
             }
             $2 = $6 - 1 | 0;
             $15 = $23 - 1 | 0;
             if (!(($15 | 0) != -1 ? $2 + 1 | 0 : $2) & $15 >>> 0 <= 1) {
              break block38
             }
            }
            $12 = $20;
            $23 = $21;
            $6 = $26;
            $8 = $30;
            $22 = $19;
            $24 = $17;
            $3 = $29;
            $2 = $31;
            break block34;
           }
           $12 = $29;
           $23 = $31;
           $6 = $20;
           $8 = $21;
           $22 = $19;
           $24 = $17;
           $3 = $26;
           $2 = $30;
           if ($15 - 1 | 0) {
            break block34
           }
           $6 = $3;
           $8 = $2;
           $3 = $20;
           $2 = $21;
           break block34;
          }
          $2 = $6 - 1 | 0;
          $8 = $23 - 4 | 0;
          $23 = $8 >>> 0 < 4294967292 ? $2 + 1 | 0 : $2;
          if (!$23 & $8 >>> 0 >= 33 | $23) {
           break block28
          }
          $24 = $8 << 3;
          $2 = $24 + 6656 | 0;
          $22 = $5 & HEAP32[$2 >> 2];
          $29 = $4 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $4 >>> $2 | 0;
          } else {
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
          }
          $4 = $6;
          $2 = $7;
          $7 = $2 - $8 | 0;
          $9 = $9 - (($2 >>> 0 < $8 >>> 0) + $23 | 0) | 0;
          if (($9 | 0) < 0) {
           $8 = HEAP32[$18 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $8 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
            $2 = $8 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $18 = $18 + 4 | 0;
           $5 = $2;
          }
          $34 = $3 + 3 | 0;
          $14 = $34 >>> 0 < 3 ? $12 + 1 | 0 : $12;
          $2 = $24 + 6400 | 0;
          $3 = HEAP32[$2 >> 2];
          $2 = $29 + HEAP32[$2 + 4 >> 2] | 0;
          $3 = $3 + $22 | 0;
          $2 = $3 >>> 0 < $22 >>> 0 ? $2 + 1 | 0 : $2;
          $12 = $20;
          $23 = $21;
          $6 = $26;
          $8 = $30;
          $22 = $19;
          $24 = $17;
         }
         if (!(($2 | 0) == ($16 | 0) & $3 >>> 0 <= $13 >>> 0 | $2 >>> 0 < $16 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 - -64 | 0;
          HEAP32[$4 >> 2] = $3;
          HEAP32[$4 + 4 >> 2] = $2;
          HEAP32[$11 + 56 >> 2] = $5;
          HEAP32[$11 + 60 >> 2] = $1;
          HEAP32[$11 + 48 >> 2] = $13;
          HEAP32[$11 + 52 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $10 = 0 - $3 | 0;
         $15 = 0 - ((($3 | 0) != 0) + $2 | 0) | 0;
         $20 = $14 + $16 | 0;
         $17 = $20 + 1 | 0;
         $21 = $20;
         $20 = $13 + $34 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $17 : $21;
         if (!(($28 | 0) == ($19 | 0) & $20 >>> 0 <= $35 >>> 0 | $19 >>> 0 < $28 >>> 0)) {
          $25 = 1;
          $27 = 0;
          break block8;
         }
         $21 = $10;
         $17 = $10 + $33 | 0;
         HEAP8[$13 + $33 | 0] = HEAPU8[$17 + $13 | 0];
         $26 = $13 + 1 | 0;
         HEAP8[$26 + $33 | 0] = HEAPU8[$17 + $26 | 0];
         $25 = $13 + 2 | 0;
         $27 = $25 >>> 0 < 2 ? $16 + 1 | 0 : $16;
         block44 : {
          if (!(($19 | 0) == ($27 | 0) & $20 >>> 0 > $25 >>> 0 | $19 >>> 0 > $27 >>> 0)) {
           $13 = $25;
           $19 = $27;
           break block44;
          }
          $17 = $14 - 1 | 0;
          $26 = $34 - 3 | 0;
          $30 = $26 >>> 0 < 4294967293 ? $17 + 1 | 0 : $17;
          $17 = $34 & 3 ^ 2;
          if ($17) {
           $10 = 0;
           $15 = 0;
           $29 = 0 - $17 | 0;
           $17 = 0 - (($17 | 0) != 0) | 0;
           while (1) {
            HEAP8[$37 | 0] = HEAPU8[$21 + $37 | 0];
            $37 = $37 + 1 | 0;
            $31 = $15 - 1 | 0;
            $10 = $10 - 1 | 0;
            $15 = ($10 | 0) != -1 ? $31 + 1 | 0 : $31;
            if (($10 | 0) != ($29 | 0) | ($15 | 0) != ($17 | 0)) {
             continue
            }
            break;
           };
           $17 = $16 - (($10 >>> 0 > $13 >>> 0) + $15 | 0) | 0;
           $25 = ($13 - $10 | 0) + 2 | 0;
           $27 = $25 >>> 0 < 2 ? $17 + 1 | 0 : $17;
          }
          if (!(!$30 & $26 >>> 0 < 3)) {
           $10 = $25 - $34 | 0;
           $15 = $27 - (($25 >>> 0 < $34 >>> 0) + $14 | 0) | 0;
           $14 = $25 + $33 | 0;
           while (1) {
            $17 = $14 + $21 | 0;
            HEAP8[$14 | 0] = HEAPU8[$17 | 0];
            HEAP8[$14 + 1 | 0] = HEAPU8[$17 + 1 | 0];
            HEAP8[$14 + 2 | 0] = HEAPU8[$17 + 2 | 0];
            HEAP8[$14 + 3 | 0] = HEAPU8[$17 + 3 | 0];
            $14 = $14 + 4 | 0;
            $10 = $10 + 4 | 0;
            $15 = $10 >>> 0 < 4 ? $15 + 1 | 0 : $15;
            if (($10 | 0) != ($13 | 0) | ($15 | 0) != ($16 | 0)) {
             continue
            }
            break;
           };
          }
          $13 = $20;
         }
         $16 = $19;
         $25 = 1;
         $27 = 0;
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
          continue
         }
         break;
        };
       }
       HEAP32[$1 + 248 >> 2] = 0;
       HEAP32[$1 + 252 >> 2] = 0;
       break block47;
      }
      HEAP32[$0 >> 2] = 9;
      HEAP32[$11 + 80 >> 2] = $13;
      HEAP32[$11 + 84 >> 2] = $16;
      HEAP8[$0 + 16 | 0] = 0;
      break block2;
     }
     wasm2js_trap();
    }
    $14 = $13 + $33 | 0;
    while (1) {
     HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
     $14 = $14 + 1 | 0;
     $13 = $13 + 1 | 0;
     $16 = $13 ? $16 : $16 + 1 | 0;
     if (($28 | 0) == ($16 | 0) & $13 >>> 0 < $35 >>> 0 | $16 >>> 0 < $28 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $10;
    HEAP32[$0 + 4 >> 2] = $15;
    HEAP32[$1 + 248 >> 2] = $20 - $35;
    HEAP32[$1 + 252 >> 2] = $19 - (($20 >>> 0 < $35 >>> 0) + $28 | 0);
   }
   HEAP32[$1 + 240 >> 2] = $12;
   HEAP32[$1 + 244 >> 2] = $23;
   HEAP32[$1 + 232 >> 2] = $6;
   HEAP32[$1 + 236 >> 2] = $8;
   HEAP32[$1 + 224 >> 2] = $22;
   HEAP32[$1 + 228 >> 2] = $24;
   HEAP32[$1 + 216 >> 2] = $3;
   HEAP32[$1 + 220 >> 2] = $2;
   HEAP32[$1 + 208 >> 2] = $25;
   HEAP32[$1 + 212 >> 2] = $27;
   HEAP32[$1 + 200 >> 2] = $18;
   HEAP32[$1 + 192 >> 2] = $7;
   HEAP32[$1 + 196 >> 2] = $9;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $4;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $16;
  }
  __stack_pointer = $11 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount4_Ptr3_Mtf3($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0, $41 = 0, $42 = 0, $43 = 0;
  $10 = __stack_pointer - 272 | 0;
  __stack_pointer = $10;
  $4 = $1 - -64 | 0;
  $33 = HEAP32[$4 >> 2];
  $29 = HEAP32[$4 + 4 >> 2];
  $4 = $1 + 48 | 0;
  $12 = HEAP32[$4 >> 2];
  $6 = $1 + 56 | 0;
  $35 = HEAP32[$6 >> 2];
  block2 : {
   block1 : {
    $14 = HEAP32[$4 + 4 >> 2];
    $2 = $14;
    $31 = HEAP32[$6 + 4 >> 2];
    $4 = $31;
    if (!(($2 | 0) == ($4 | 0) & $12 >>> 0 >= $35 >>> 0 | $2 >>> 0 > $4 >>> 0)) {
     if (($4 | 0) == ($29 | 0) & $33 >>> 0 >= $35 >>> 0 | $4 >>> 0 < $29 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $10 + 40 | 0;
    HEAP32[$1 >> 2] = $33;
    HEAP32[$1 + 4 >> 2] = $29;
    $1 = $10 + 32 | 0;
    HEAP32[$1 >> 2] = $35;
    HEAP32[$1 + 4 >> 2] = $31;
    $1 = $10 + 24 | 0;
    HEAP32[$1 >> 2] = $12;
    HEAP32[$1 + 4 >> 2] = $14;
    HEAP32[$10 + 12 >> 2] = 42;
    HEAP32[$10 + 16 >> 2] = 0;
    HEAP32[$10 + 8 >> 2] = 3772;
    HEAP32[$10 + 4 >> 2] = 5063;
    HEAP32[$10 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $6 = $1 + 144 | 0;
   $4 = HEAP32[$6 >> 2];
   $6 = HEAP32[$6 + 4 >> 2];
   if (!(!$6 & ($4 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$10 + 256 >> 2] = 4;
    $1 = $10 + 248 | 0;
    HEAP32[$1 >> 2] = $4;
    HEAP32[$1 + 4 >> 2] = $6;
    HEAP32[$10 + 236 >> 2] = 50;
    HEAP32[$10 + 240 >> 2] = 0;
    HEAP32[$10 + 232 >> 2] = 3772;
    HEAP32[$10 + 228 >> 2] = 5063;
    HEAP32[$10 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $6 = $1 + 160 | 0;
   $4 = HEAP32[$6 >> 2];
   $6 = HEAP32[$6 + 4 >> 2];
   if (!(!$6 & ($4 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$10 + 208 >> 2] = 3;
    $1 = $10 + 200 | 0;
    HEAP32[$1 >> 2] = $4;
    HEAP32[$1 + 4 >> 2] = $6;
    HEAP32[$10 + 188 >> 2] = 58;
    HEAP32[$10 + 192 >> 2] = 0;
    HEAP32[$10 + 184 >> 2] = 3772;
    HEAP32[$10 + 180 >> 2] = 5063;
    HEAP32[$10 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $6 = $1 + 152 | 0;
   $4 = HEAP32[$6 >> 2];
   $6 = HEAP32[$6 + 4 >> 2];
   if (!(!$6 & ($4 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$10 + 160 >> 2] = 3;
    $1 = $10 + 152 | 0;
    HEAP32[$1 >> 2] = $4;
    HEAP32[$1 + 4 >> 2] = $6;
    HEAP32[$10 + 140 >> 2] = 66;
    HEAP32[$10 + 144 >> 2] = 0;
    HEAP32[$10 + 136 >> 2] = 3772;
    HEAP32[$10 + 132 >> 2] = 5063;
    HEAP32[$10 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $41 = HEAP32[$1 + 176 >> 2];
   $42 = HEAP32[$1 + 172 >> 2];
   $4 = $1 + 240 | 0;
   $2 = HEAP32[$4 >> 2];
   $5 = HEAP32[$4 + 4 >> 2];
   $4 = $1 + 232 | 0;
   $17 = HEAP32[$4 >> 2];
   $21 = HEAP32[$4 + 4 >> 2];
   $4 = $1 + 224 | 0;
   $22 = HEAP32[$4 >> 2];
   $25 = HEAP32[$4 + 4 >> 2];
   $4 = $1 + 216 | 0;
   $3 = HEAP32[$4 >> 2];
   $16 = HEAP32[$4 + 4 >> 2];
   $4 = $1 + 208 | 0;
   $24 = HEAP32[$4 >> 2];
   $26 = HEAP32[$4 + 4 >> 2];
   $32 = HEAP32[$1 + 264 >> 2];
   $18 = HEAP32[$1 + 200 >> 2];
   $4 = $1 + 192 | 0;
   $7 = HEAP32[$4 >> 2];
   $8 = HEAP32[$4 + 4 >> 2];
   $4 = $1 + 184 | 0;
   $6 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   $11 = $1 + 248 | 0;
   $20 = HEAP32[$11 >> 2];
   $19 = HEAP32[$11 + 4 >> 2];
   $27 = $19;
   block46 : {
    block8 : {
     block28 : {
      block35 : {
       $11 = $20;
       block9 : {
        if ($19 | $11) {
         $23 = $1 + 256 | 0;
         $20 = HEAP32[$23 >> 2];
         $19 = 0 - $20 | 0;
         $23 = HEAP32[$23 + 4 >> 2];
         $28 = 0 - ($23 + (($20 | 0) != 0) | 0) | 0;
         if (!(($28 | 0) == ($14 | 0) & $12 >>> 0 >= $19 >>> 0 | $14 >>> 0 > $28 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $4 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $6 = $10 + 112 | 0;
          HEAP32[$6 >> 2] = $19;
          HEAP32[$6 + 4 >> 2] = $28;
          HEAP32[$10 + 104 >> 2] = $4;
          HEAP32[$10 + 108 >> 2] = $1;
          HEAP32[$10 + 96 >> 2] = $12;
          HEAP32[$10 + 100 >> 2] = $14;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $19 = $14 + $27 | 0;
         $9 = $12 + $11 | 0;
         $15 = $9 >>> 0 < $12 >>> 0 ? $19 + 1 | 0 : $19;
         if (($29 | 0) == ($15 | 0) & $9 >>> 0 > $33 >>> 0 | $15 >>> 0 > $29 >>> 0) {
          break block8
         }
         $13 = $12 + $32 | 0;
         while (1) {
          HEAP8[$13 | 0] = HEAPU8[$13 + $20 | 0];
          $13 = $13 + 1 | 0;
          $12 = $12 + 1 | 0;
          $14 = $12 ? $14 : $14 + 1 | 0;
          if (($15 | 0) == ($14 | 0) & $9 >>> 0 > $12 >>> 0 | $14 >>> 0 < $15 >>> 0) {
           continue
          }
          break;
         };
         if (($14 | 0) == ($31 | 0) & $12 >>> 0 >= $35 >>> 0 | $14 >>> 0 > $31 >>> 0) {
          break block9
         }
        }
        $43 = $32 + 2 | 0;
        while (1) {
         $28 = $3;
         $27 = $16;
         $19 = $22;
         $23 = $25;
         $20 = $17;
         $11 = $21;
         $36 = $2;
         $37 = $5;
         $34 = $12 + 3 | 0;
         $39 = $34 >>> 0 < 3 ? $14 + 1 | 0 : $14;
         $38 = $12 + $43 | 0;
         block17 : {
          while (1) {
           $17 = HEAP16[(($6 & 4095) << 1) + $42 >> 1];
           $9 = $17;
           $15 = $9 >> 31;
           block11 : {
            if (($9 | 0) >= 0) {
             $2 = $18;
             break block11;
            }
            $3 = $9 & 15;
            $2 = $3;
            $5 = $4 >>> $2 | 0;
            $6 = ((1 << $2) - 1 & $4) << 32 - $2 | $6 >>> $2;
            $4 = $5;
            $2 = $7;
            $7 = $2 - $3 | 0;
            $8 = $8 - ($2 >>> 0 < $3 >>> 0) | 0;
            if (($8 | 0) < -1) {
             $2 = 1
            } else {
             $2 = ($8 | 0) < 0
            }
            block13 : {
             if (!$2) {
              $2 = $18;
              break block13;
             }
             $2 = $18 + 4 | 0;
             $16 = HEAP32[$18 >> 2];
             $7 = $7 + 32 | 0;
             $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $5 = $16 << $3;
              $3 = 0;
             } else {
              $5 = (1 << $3) - 1 & $16 >>> 32 - $3;
              $3 = $16 << $3;
             }
             $3 = $3 + $6 | 0;
             $4 = $4 + $5 | 0;
             $4 = $3 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
             $6 = $3;
            }
            $18 = (($17 & 2147483632) << 1) + $42 | 0;
            $13 = HEAP16[$18 + (($6 & 63) << 1) >> 1];
            $9 = $13;
            $15 = $9 >> 31;
            if (($9 | 0) >= 0) {
             break block11
            }
            while (1) {
             $3 = $9 & 15;
             $5 = $4 >>> $3 | 0;
             $6 = ((1 << $3) - 1 & $4) << 32 - $3 | $6 >>> $3;
             $4 = $5;
             $5 = $7;
             $7 = $5 - $3 | 0;
             $8 = $8 - ($3 >>> 0 > $5 >>> 0) | 0;
             if (($8 | 0) < 0) {
              $16 = HEAP32[$2 >> 2];
              $7 = $7 + 32 | 0;
              $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
              $3 = $7 & 31;
              if (($7 & 63) >>> 0 >= 32) {
               $5 = $16 << $3;
               $3 = 0;
              } else {
               $5 = (1 << $3) - 1 & $16 >>> 32 - $3;
               $3 = $16 << $3;
              }
              $3 = $3 + $6 | 0;
              $4 = $4 + $5 | 0;
              $4 = $3 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
              $2 = $2 + 4 | 0;
              $6 = $3;
             }
             $18 = (($13 & 65520) << 16 >> 16 << 1) + $18 | 0;
             $13 = HEAP16[$18 + (($6 & 63) << 1) >> 1];
             $9 = $13;
             $15 = $9 >> 31;
             if (($9 | 0) < 0) {
              continue
             }
             break;
            };
           }
           $3 = $9 & 15;
           $5 = $4 >>> $3 | 0;
           $6 = ((1 << $3) - 1 & $4) << 32 - $3 | $6 >>> $3;
           $4 = $5;
           $5 = $7;
           $7 = $5 - $3 | 0;
           $8 = $8 - ($3 >>> 0 > $5 >>> 0) | 0;
           if (($8 | 0) < -1) {
            $5 = 1
           } else {
            $5 = ($8 | 0) < 0
           }
           block16 : {
            if (!$5) {
             $18 = $2;
             break block16;
            }
            $18 = $2 + 4 | 0;
            $3 = HEAP32[$2 >> 2];
            $7 = $7 + 32 | 0;
            $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $5 = $3 << $2;
             $2 = 0;
            } else {
             $5 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $6 | 0;
            $4 = $4 + $5 | 0;
            $4 = $2 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
            $6 = $2;
           }
           $16 = ($15 & 15) << 28 | $9 >>> 4;
           $21 = $15 >>> 4 | 0;
           if (!$15 & $9 >>> 0 > 4095 | $15) {
            break block17
           }
           HEAP8[$12 + $32 | 0] = $16;
           $38 = $38 + 1 | 0;
           $34 = $34 + 1 | 0;
           $39 = $34 ? $39 : $39 + 1 | 0;
           $24 = 0;
           $26 = 0;
           $12 = $12 + 1 | 0;
           $14 = $12 ? $14 : $14 + 1 | 0;
           if (($31 | 0) == ($14 | 0) & $12 >>> 0 < $35 >>> 0 | $14 >>> 0 < $31 >>> 0) {
            continue
           }
           break;
          };
          $2 = $36;
          $5 = $37;
          $17 = $20;
          $21 = $11;
          $22 = $19;
          $25 = $23;
          $3 = $28;
          $16 = $27;
          break block9;
         }
         $30 = $16 & 15;
         if (($30 | 0) != 15) {
          $2 = 0
         } else {
          $22 = HEAP16[(($6 & 4095) << 1) + $41 >> 1];
          $9 = $22;
          $15 = $9 >> 31;
          block20 : {
           if (($9 | 0) >= 0) {
            $2 = $18;
            break block20;
           }
           $3 = $9 & 15;
           $2 = $3;
           $5 = $4 >>> $2 | 0;
           $6 = ((1 << $2) - 1 & $4) << 32 - $2 | $6 >>> $2;
           $4 = $5;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $8 = $8 - ($2 >>> 0 < $3 >>> 0) | 0;
           if (($8 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($8 | 0) < 0
           }
           block22 : {
            if (!$2) {
             $2 = $18;
             break block22;
            }
            $2 = $18 + 4 | 0;
            $17 = HEAP32[$18 >> 2];
            $7 = $7 + 32 | 0;
            $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
            $3 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $5 = $17 << $3;
             $3 = 0;
            } else {
             $5 = (1 << $3) - 1 & $17 >>> 32 - $3;
             $3 = $17 << $3;
            }
            $3 = $3 + $6 | 0;
            $4 = $4 + $5 | 0;
            $4 = $3 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
            $6 = $3;
           }
           $18 = (($22 & 2147483632) << 1) + $41 | 0;
           $13 = HEAP16[$18 + (($6 & 63) << 1) >> 1];
           $9 = $13;
           $15 = $9 >> 31;
           if (($9 | 0) >= 0) {
            break block20
           }
           while (1) {
            $3 = $9 & 15;
            $5 = $4 >>> $3 | 0;
            $6 = ((1 << $3) - 1 & $4) << 32 - $3 | $6 >>> $3;
            $4 = $5;
            $5 = $7;
            $7 = $5 - $3 | 0;
            $8 = $8 - ($3 >>> 0 > $5 >>> 0) | 0;
            if (($8 | 0) < 0) {
             $17 = HEAP32[$2 >> 2];
             $7 = $7 + 32 | 0;
             $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $5 = $17 << $3;
              $3 = 0;
             } else {
              $5 = (1 << $3) - 1 & $17 >>> 32 - $3;
              $3 = $17 << $3;
             }
             $3 = $3 + $6 | 0;
             $4 = $4 + $5 | 0;
             $4 = $3 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
             $2 = $2 + 4 | 0;
             $6 = $3;
            }
            $18 = (($13 & 65520) << 16 >> 16 << 1) + $18 | 0;
            $13 = HEAP16[$18 + (($6 & 63) << 1) >> 1];
            $9 = $13;
            $15 = $9 >> 31;
            if (($9 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $3 = $9 & 15;
          $5 = $4 >>> $3 | 0;
          $6 = ((1 << $3) - 1 & $4) << 32 - $3 | $6 >>> $3;
          $4 = $5;
          $5 = $7;
          $7 = $5 - $3 | 0;
          $8 = $8 - ($3 >>> 0 > $5 >>> 0) | 0;
          if (($8 | 0) < -1) {
           $5 = 1
          } else {
           $5 = ($8 | 0) < 0
          }
          block25 : {
           if (!$5) {
            $13 = $2;
            break block25;
           }
           $13 = $2 + 4 | 0;
           $3 = HEAP32[$2 >> 2];
           $7 = $7 + 32 | 0;
           $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $5 = $3 << $2;
            $2 = 0;
           } else {
            $5 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $2 = $3 << $2;
           }
           $2 = $2 + $6 | 0;
           $4 = $4 + $5 | 0;
           $4 = $2 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
           $6 = $2;
          }
          $5 = $15 >>> 4 | 0;
          $2 = ($15 & 15) << 28 | $9 >>> 4;
          block27 : {
           if (!(!$15 & $9 >>> 0 >= 3712 | ($15 | 0) != 0)) {
            $18 = $13;
            break block27;
           }
           $5 = $5 - 1 | 0;
           $3 = $2 - 232 | 0;
           $17 = $3 >>> 0 < 4294967064 ? $5 + 1 | 0 : $5;
           if (!$17 & $3 >>> 0 >= 33 | $17) {
            break block28
           }
           $22 = $3 << 3;
           $2 = $22 + 6656 | 0;
           $25 = $6 & HEAP32[$2 >> 2];
           $15 = $4 & HEAP32[$2 + 4 >> 2];
           $2 = $3 & 31;
           if (($3 & 63) >>> 0 >= 32) {
            $5 = 0;
            $6 = $4 >>> $2 | 0;
           } else {
            $5 = $4 >>> $2 | 0;
            $6 = ((1 << $2) - 1 & $4) << 32 - $2 | $6 >>> $2;
           }
           $4 = $5;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $8 = $8 - (($2 >>> 0 < $3 >>> 0) + $17 | 0) | 0;
           if (($8 | 0) < -1) {
            $2 = 1
           } else {
            $2 = ($8 | 0) < 0
           }
           block30 : {
            if (!$2) {
             $18 = $13;
             break block30;
            }
            $18 = $13 + 4 | 0;
            $3 = HEAP32[$13 >> 2];
            $7 = $7 + 32 | 0;
            $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $5 = $3 << $2;
             $2 = 0;
            } else {
             $5 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $6 | 0;
            $4 = $4 + $5 | 0;
            $4 = $2 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
            $6 = $2;
           }
           $5 = $22 + 6400 | 0;
           $3 = HEAP32[$5 >> 2];
           $2 = $3 + $25 | 0;
           $5 = HEAP32[$5 + 4 >> 2] + $15 | 0;
           $5 = $2 >>> 0 < $3 >>> 0 ? $5 + 1 | 0 : $5;
           $2 = $2 + 231 | 0;
           $5 = $2 >>> 0 < 231 ? $5 + 1 | 0 : $5;
          }
          $30 = $2 + 15 | 0;
          $2 = $30 >>> 0 < 15 ? $5 + 1 | 0 : $5;
         }
         $40 = $2;
         $2 = $21 - 1 | 0;
         $5 = $16 - 256 | 0;
         $2 = $5 >>> 0 < 4294967040 ? $2 + 1 | 0 : $2;
         $3 = $2 >>> 4 | 0;
         $16 = ($2 & 15) << 28 | $5 >>> 4;
         $17 = ($2 | 0) != 0;
         $21 = !$2;
         block34 : {
          if (!($17 | $21 & $5 >>> 0 > 63)) {
           block38 : {
            block36 : {
             if ($24 | $26) {
              if (!($17 | $5 >>> 0 >= 16 & $21)) {
               $2 = $36;
               $5 = $37;
               $17 = $20;
               $21 = $11;
               $22 = $28;
               $25 = $27;
               $3 = $19;
               $16 = $23;
               break block34;
              }
              $2 = $3 - 1 | 0;
              $13 = $16 - 1 | 0;
              $2 = ($13 | 0) != -1 ? $2 + 1 | 0 : $2;
              if (!$2 & $13 >>> 0 > 1 | $2) {
               break block35
              }
              $2 = $36;
              $5 = $37;
              $17 = $19;
              $21 = $23;
              $22 = $28;
              $25 = $27;
              $3 = $20;
              $16 = $11;
              if ($13 - 1 | 0) {
               break block34
              }
              break block36;
             }
             if (!(!$2 & $5 >>> 0 >= 16 | ($2 | 0) != 0)) {
              $2 = $36;
              $5 = $37;
              $17 = $20;
              $21 = $11;
              $22 = $19;
              $25 = $23;
              $3 = $28;
              $16 = $27;
              break block34;
             }
             $2 = $3 - 1 | 0;
             $3 = $2 + 1 | 0;
             $5 = $2;
             $2 = $16 - 1 | 0;
             $13 = $2;
             if (!(($2 | 0) != -1 ? $3 : $5) & $2 >>> 0 <= 1) {
              break block38
             }
            }
            $2 = $20;
            $5 = $11;
            $17 = $19;
            $21 = $23;
            $22 = $28;
            $25 = $27;
            $3 = $36;
            $16 = $37;
            break block34;
           }
           $2 = $36;
           $5 = $37;
           $17 = $20;
           $21 = $11;
           $22 = $28;
           $25 = $27;
           $3 = $19;
           $16 = $23;
           if ($13 - 1 | 0) {
            break block34
           }
           $17 = $3;
           $21 = $16;
           $3 = $20;
           $16 = $11;
           break block34;
          }
          $2 = $3 - 1 | 0;
          $3 = $16 - 4 | 0;
          $16 = $3 >>> 0 < 4294967292 ? $2 + 1 | 0 : $2;
          if (!$16 & $3 >>> 0 >= 33 | $16) {
           break block28
          }
          $21 = $3 << 3;
          $2 = $21 + 6656 | 0;
          $17 = $6 & HEAP32[$2 >> 2];
          $22 = $4 & HEAP32[$2 + 4 >> 2];
          $2 = $3 & 31;
          if (($3 & 63) >>> 0 >= 32) {
           $5 = 0;
           $6 = $4 >>> $2 | 0;
          } else {
           $5 = $4 >>> $2 | 0;
           $6 = ((1 << $2) - 1 & $4) << 32 - $2 | $6 >>> $2;
          }
          $4 = $5;
          $2 = $7;
          $7 = $2 - $3 | 0;
          $8 = $8 - (($2 >>> 0 < $3 >>> 0) + $16 | 0) | 0;
          if (($8 | 0) < 0) {
           $3 = HEAP32[$18 >> 2];
           $7 = $7 + 32 | 0;
           $8 = $7 >>> 0 < 32 ? $8 + 1 | 0 : $8;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $5 = $3 << $2;
            $2 = 0;
           } else {
            $5 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $2 = $3 << $2;
           }
           $2 = $2 + $6 | 0;
           $4 = $4 + $5 | 0;
           $4 = $2 >>> 0 < $6 >>> 0 ? $4 + 1 | 0 : $4;
           $18 = $18 + 4 | 0;
           $6 = $2;
          }
          $2 = $21 + 6400 | 0;
          $5 = HEAP32[$2 >> 2];
          $2 = $22 + HEAP32[$2 + 4 >> 2] | 0;
          $3 = $5 + $17 | 0;
          $16 = $17 >>> 0 > $3 >>> 0 ? $2 + 1 | 0 : $2;
          $2 = $20;
          $5 = $11;
          $17 = $19;
          $21 = $23;
          $22 = $28;
          $25 = $27;
         }
         if (!(($14 | 0) == ($16 | 0) & $3 >>> 0 <= $12 >>> 0 | $14 >>> 0 > $16 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $4 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $6 = $10 - -64 | 0;
          HEAP32[$6 >> 2] = $3;
          HEAP32[$6 + 4 >> 2] = $16;
          HEAP32[$10 + 56 >> 2] = $4;
          HEAP32[$10 + 60 >> 2] = $1;
          HEAP32[$10 + 48 >> 2] = $12;
          HEAP32[$10 + 52 >> 2] = $14;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $20 = 0 - $3 | 0;
         $23 = 0 - ((($3 | 0) != 0) + $16 | 0) | 0;
         $11 = $14 + $40 | 0;
         $19 = $11 + 1 | 0;
         $27 = $11;
         $11 = $12 + $30 | 0;
         $19 = $11 >>> 0 < $30 >>> 0 ? $19 : $27;
         $9 = $11 + 3 | 0;
         $15 = $9 >>> 0 < 3 ? $19 + 1 | 0 : $19;
         if (!(($29 | 0) == ($15 | 0) & $9 >>> 0 <= $33 >>> 0 | $15 >>> 0 < $29 >>> 0)) {
          $24 = 1;
          $26 = 0;
          break block8;
         }
         $11 = $20 + $32 | 0;
         HEAP8[$12 + $32 | 0] = HEAPU8[$11 + $12 | 0];
         $19 = $12 + 1 | 0;
         HEAP8[$19 + $32 | 0] = HEAPU8[$11 + $19 | 0];
         $24 = $12 + 2 | 0;
         $26 = $24 >>> 0 < 2 ? $14 + 1 | 0 : $14;
         block44 : {
          if (!(($15 | 0) == ($26 | 0) & $9 >>> 0 > $24 >>> 0 | $15 >>> 0 > $26 >>> 0)) {
           $12 = $24;
           $14 = $26;
           break block44;
          }
          $11 = $30 + 1 & 3;
          if ($11) {
           $9 = 0;
           $15 = 0;
           $19 = 0 - $11 | 0;
           $11 = 0 - (($11 | 0) != 0) | 0;
           while (1) {
            HEAP8[$38 | 0] = HEAPU8[$20 + $38 | 0];
            $38 = $38 + 1 | 0;
            $23 = $15 - 1 | 0;
            $9 = $9 - 1 | 0;
            $15 = ($9 | 0) != -1 ? $23 + 1 | 0 : $23;
            if (($9 | 0) != ($19 | 0) | ($15 | 0) != ($11 | 0)) {
             continue
            }
            break;
           };
           $11 = $14 - (($9 >>> 0 > $12 >>> 0) + $15 | 0) | 0;
           $24 = ($12 - $9 | 0) + 2 | 0;
           $26 = $24 >>> 0 < 2 ? $11 + 1 | 0 : $11;
          }
          $11 = $39 + $40 | 0;
          $12 = $30 + $34 | 0;
          $14 = $12 >>> 0 < $34 >>> 0 ? $11 + 1 | 0 : $11;
          if (!$40 & $30 >>> 0 < 3) {
           break block44
          }
          $9 = $24 - $30 | 0;
          $15 = $26 - (($24 >>> 0 < $30 >>> 0) + $40 | 0) | 0;
          $13 = $24 + $32 | 0;
          while (1) {
           $11 = $13 + $20 | 0;
           HEAP8[$13 | 0] = HEAPU8[$11 | 0];
           HEAP8[$13 + 1 | 0] = HEAPU8[$11 + 1 | 0];
           HEAP8[$13 + 2 | 0] = HEAPU8[$11 + 2 | 0];
           HEAP8[$13 + 3 | 0] = HEAPU8[$11 + 3 | 0];
           $13 = $13 + 4 | 0;
           $9 = $9 + 4 | 0;
           $15 = $9 >>> 0 < 4 ? $15 + 1 | 0 : $15;
           if (($9 | 0) != ($34 | 0) | ($15 | 0) != ($39 | 0)) {
            continue
           }
           break;
          };
         }
         $24 = 1;
         $26 = 0;
         if (($14 | 0) == ($31 | 0) & $12 >>> 0 < $35 >>> 0 | $14 >>> 0 < $31 >>> 0) {
          continue
         }
         break;
        };
       }
       HEAP32[$1 + 248 >> 2] = 0;
       HEAP32[$1 + 252 >> 2] = 0;
       break block46;
      }
      HEAP32[$0 >> 2] = 9;
      HEAP32[$10 + 80 >> 2] = $12;
      HEAP32[$10 + 84 >> 2] = $14;
      HEAP8[$0 + 16 | 0] = 0;
      break block2;
     }
     wasm2js_trap();
    }
    $13 = $12 + $32 | 0;
    while (1) {
     HEAP8[$13 | 0] = HEAPU8[$13 + $20 | 0];
     $13 = $13 + 1 | 0;
     $12 = $12 + 1 | 0;
     $14 = $12 ? $14 : $14 + 1 | 0;
     if (($29 | 0) == ($14 | 0) & $12 >>> 0 < $33 >>> 0 | $14 >>> 0 < $29 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $20;
    HEAP32[$0 + 4 >> 2] = $23;
    HEAP32[$1 + 248 >> 2] = $9 - $33;
    HEAP32[$1 + 252 >> 2] = $15 - (($9 >>> 0 < $33 >>> 0) + $29 | 0);
   }
   HEAP32[$1 + 240 >> 2] = $2;
   HEAP32[$1 + 244 >> 2] = $5;
   HEAP32[$1 + 232 >> 2] = $17;
   HEAP32[$1 + 236 >> 2] = $21;
   HEAP32[$1 + 224 >> 2] = $22;
   HEAP32[$1 + 228 >> 2] = $25;
   HEAP32[$1 + 216 >> 2] = $3;
   HEAP32[$1 + 220 >> 2] = $16;
   HEAP32[$1 + 208 >> 2] = $24;
   HEAP32[$1 + 212 >> 2] = $26;
   HEAP32[$1 + 200 >> 2] = $18;
   HEAP32[$1 + 192 >> 2] = $7;
   HEAP32[$1 + 196 >> 2] = $8;
   HEAP32[$1 + 184 >> 2] = $6;
   HEAP32[$1 + 188 >> 2] = $4;
   HEAP32[$1 + 48 >> 2] = $12;
   HEAP32[$1 + 52 >> 2] = $14;
  }
  __stack_pointer = $10 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount4_Ptr4_Mtf2($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0;
  $11 = __stack_pointer - 272 | 0;
  __stack_pointer = $11;
  $5 = $1 - -64 | 0;
  $35 = HEAP32[$5 >> 2];
  $28 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $4 = $1 + 56 | 0;
  $36 = HEAP32[$4 >> 2];
  block2 : {
   block1 : {
    $16 = HEAP32[$5 + 4 >> 2];
    $2 = $16;
    $32 = HEAP32[$4 + 4 >> 2];
    $5 = $32;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $36 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($28 | 0) & $35 >>> 0 >= $36 >>> 0 | $5 >>> 0 < $28 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $11 + 40 | 0;
    HEAP32[$1 >> 2] = $35;
    HEAP32[$1 + 4 >> 2] = $28;
    $1 = $11 + 32 | 0;
    HEAP32[$1 >> 2] = $36;
    HEAP32[$1 + 4 >> 2] = $32;
    $1 = $11 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $16;
    HEAP32[$11 + 12 >> 2] = 42;
    HEAP32[$11 + 16 >> 2] = 0;
    HEAP32[$11 + 8 >> 2] = 3772;
    HEAP32[$11 + 4 >> 2] = 5182;
    HEAP32[$11 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 144 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 256 >> 2] = 4;
    $1 = $11 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 236 >> 2] = 50;
    HEAP32[$11 + 240 >> 2] = 0;
    HEAP32[$11 + 232 >> 2] = 3772;
    HEAP32[$11 + 228 >> 2] = 5182;
    HEAP32[$11 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 160 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 2)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 208 >> 2] = 2;
    $1 = $11 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 188 >> 2] = 58;
    HEAP32[$11 + 192 >> 2] = 0;
    HEAP32[$11 + 184 >> 2] = 3772;
    HEAP32[$11 + 180 >> 2] = 5182;
    HEAP32[$11 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 152 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 160 >> 2] = 4;
    $1 = $11 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 140 >> 2] = 66;
    HEAP32[$11 + 144 >> 2] = 0;
    HEAP32[$11 + 136 >> 2] = 3772;
    HEAP32[$11 + 132 >> 2] = 5182;
    HEAP32[$11 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $38 = HEAP32[$1 + 176 >> 2];
   $39 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 240 | 0;
   $12 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 232 | 0;
   $6 = HEAP32[$5 >> 2];
   $8 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 224 | 0;
   $22 = HEAP32[$5 >> 2];
   $24 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $3 = HEAP32[$5 >> 2];
   $2 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $25 = HEAP32[$5 >> 2];
   $27 = HEAP32[$5 + 4 >> 2];
   $33 = HEAP32[$1 + 264 >> 2];
   $18 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $7 = HEAP32[$5 >> 2];
   $9 = HEAP32[$5 + 4 >> 2];
   $4 = $1 + 184 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   $21 = $1 + 248 | 0;
   $20 = HEAP32[$21 >> 2];
   $21 = HEAP32[$21 + 4 >> 2];
   $17 = $21;
   block47 : {
    block8 : {
     block28 : {
      block35 : {
       block9 : {
        if ($20 | $17) {
         $19 = $1 + 256 | 0;
         $10 = HEAP32[$19 >> 2];
         $21 = 0 - $10 | 0;
         $15 = HEAP32[$19 + 4 >> 2];
         $19 = 0 - ($15 + (($10 | 0) != 0) | 0) | 0;
         if (!(($19 | 0) == ($16 | 0) & $13 >>> 0 >= $21 >>> 0 | $16 >>> 0 > $19 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 + 112 | 0;
          HEAP32[$4 >> 2] = $21;
          HEAP32[$4 + 4 >> 2] = $19;
          HEAP32[$11 + 104 >> 2] = $5;
          HEAP32[$11 + 108 >> 2] = $1;
          HEAP32[$11 + 96 >> 2] = $13;
          HEAP32[$11 + 100 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $21 = $16 + $17 | 0;
         $20 = $13 + $20 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $21 + 1 | 0 : $21;
         if (($28 | 0) == ($19 | 0) & $20 >>> 0 > $35 >>> 0 | $19 >>> 0 > $28 >>> 0) {
          break block8
         }
         $14 = $13 + $33 | 0;
         while (1) {
          HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
          $14 = $14 + 1 | 0;
          $13 = $13 + 1 | 0;
          $16 = $13 ? $16 : $16 + 1 | 0;
          if (($19 | 0) == ($16 | 0) & $13 >>> 0 < $20 >>> 0 | $16 >>> 0 < $19 >>> 0) {
           continue
          }
          break;
         };
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 >= $36 >>> 0 | $16 >>> 0 > $32 >>> 0) {
          break block9
         }
        }
        $40 = $33 + 2 | 0;
        while (1) {
         $19 = $3;
         $17 = $2;
         $26 = $22;
         $30 = $24;
         $20 = $6;
         $21 = $8;
         $29 = $12;
         $31 = $23;
         $37 = $13 + $40 | 0;
         block17 : {
          while (1) {
           $12 = HEAP16[(($5 & 4095) << 1) + $39 >> 1];
           $10 = $12;
           $15 = $10 >> 31;
           block11 : {
            if (($10 | 0) >= 0) {
             $2 = $18;
             break block11;
            }
            $3 = $10 & 15;
            $2 = $3;
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
            $4 = $6;
            $2 = $7;
            $7 = $2 - $3 | 0;
            $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
            $9 = $2;
            block13 : {
             if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
              $2 = $18;
              break block13;
             }
             $2 = $18 + 4 | 0;
             $8 = HEAP32[$18 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $8 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
              $3 = $8 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $5 = $3;
            }
            $18 = (($12 & 2147483632) << 1) + $39 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) >= 0) {
             break block11
            }
            while (1) {
             $8 = $10 & 15;
             $3 = $8;
             $6 = $4 >>> $3 | 0;
             $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
             $4 = $6;
             $3 = $7;
             $7 = $3 - $8 | 0;
             $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
             if (($9 | 0) < 0) {
              $8 = HEAP32[$2 >> 2];
              $7 = $7 + 32 | 0;
              $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
              $3 = $7 & 31;
              if (($7 & 63) >>> 0 >= 32) {
               $6 = $8 << $3;
               $3 = 0;
              } else {
               $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
               $3 = $8 << $3;
              }
              $3 = $3 + $5 | 0;
              $4 = $4 + $6 | 0;
              $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
              $2 = $2 + 4 | 0;
              $5 = $3;
             }
             $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
             $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
             $10 = $14;
             $15 = $10 >> 31;
             if (($10 | 0) < 0) {
              continue
             }
             break;
            };
           }
           $8 = $10 & 15;
           $3 = $8;
           $6 = $4 >>> $3 | 0;
           $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
           $4 = $6;
           $3 = $7;
           $7 = $3 - $8 | 0;
           $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
           if (($9 | 0) < -1) {
            $3 = 1
           } else {
            $3 = ($9 | 0) < 0
           }
           block16 : {
            if (!$3) {
             $18 = $2;
             break block16;
            }
            $18 = $2 + 4 | 0;
            $3 = HEAP32[$2 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $8 = ($15 & 15) << 28 | $10 >>> 4;
           $23 = $15 >>> 4 | 0;
           if (!$15 & $10 >>> 0 > 4095 | $15) {
            break block17
           }
           HEAP8[$13 + $33 | 0] = $8;
           $37 = $37 + 1 | 0;
           $25 = 0;
           $27 = 0;
           $13 = $13 + 1 | 0;
           $16 = $13 ? $16 : $16 + 1 | 0;
           if (($32 | 0) == ($16 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
            continue
           }
           break;
          };
          $12 = $29;
          $23 = $31;
          $6 = $20;
          $8 = $21;
          $22 = $26;
          $24 = $30;
          $3 = $19;
          $2 = $17;
          break block9;
         }
         $3 = $8 & 15;
         if (($3 | 0) != 15) {
          $12 = 0
         } else {
          $22 = HEAP16[(($5 & 4095) << 1) + $38 >> 1];
          $10 = $22;
          $15 = $10 >> 31;
          block20 : {
           if (($10 | 0) >= 0) {
            $2 = $18;
            break block20;
           }
           $3 = $10 & 15;
           $2 = $3;
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
           $9 = $2;
           block22 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $2 = $18;
             break block22;
            }
            $2 = $18 + 4 | 0;
            $12 = HEAP32[$18 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $3 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $12 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
             $3 = $12 << $3;
            }
            $3 = $3 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $3;
           }
           $18 = (($22 & 2147483632) << 1) + $38 | 0;
           $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
           $10 = $14;
           $15 = $10 >> 31;
           if (($10 | 0) >= 0) {
            break block20
           }
           while (1) {
            $12 = $10 & 15;
            $3 = $12;
            $6 = $4 >>> $3 | 0;
            $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
            $4 = $6;
            $3 = $7;
            $7 = $3 - $12 | 0;
            $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
            if (($9 | 0) < 0) {
             $12 = HEAP32[$2 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $12 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
              $3 = $12 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $2 = $2 + 4 | 0;
             $5 = $3;
            }
            $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $12 = $10 & 15;
          $3 = $12;
          $6 = $4 >>> $3 | 0;
          $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
          $4 = $6;
          $3 = $7;
          $7 = $3 - $12 | 0;
          $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $3 = 1
          } else {
           $3 = ($9 | 0) < 0
          }
          block25 : {
           if (!$3) {
            $14 = $2;
            break block25;
           }
           $14 = $2 + 4 | 0;
           $3 = HEAP32[$2 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $3 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $2 = $3 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $5 = $2;
          }
          $3 = ($15 & 15) << 28 | $10 >>> 4;
          $2 = $15 >>> 4 | 0;
          block27 : {
           if (!(!$15 & $10 >>> 0 >= 3712 | ($15 | 0) != 0)) {
            $18 = $14;
            break block27;
           }
           $2 = $2 - 1 | 0;
           $3 = $3 - 232 | 0;
           $12 = $3 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
           if (!$12 & $3 >>> 0 >= 33 | $12) {
            break block28
           }
           $22 = $3 << 3;
           $2 = $22 + 6656 | 0;
           $24 = $5 & HEAP32[$2 >> 2];
           $15 = $4 & HEAP32[$2 + 4 >> 2];
           $2 = $3 & 31;
           if (($3 & 63) >>> 0 >= 32) {
            $6 = 0;
            $5 = $4 >>> $2 | 0;
           } else {
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           }
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - (($2 >>> 0 < $3 >>> 0) + $12 | 0) | 0;
           $9 = $2;
           block30 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $18 = $14;
             break block30;
            }
            $18 = $14 + 4 | 0;
            $3 = HEAP32[$14 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $3 = $22 + 6400 | 0;
           $6 = HEAP32[$3 >> 2];
           $2 = $6 + $24 | 0;
           $3 = HEAP32[$3 + 4 >> 2] + $15 | 0;
           $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
           $12 = $3 + 1 | 0;
           $6 = $3;
           $3 = $2 + 231 | 0;
           $2 = $3 >>> 0 < 231 ? $12 : $6;
          }
          $3 = $3 + 15 | 0;
          $12 = $3 >>> 0 < 15 ? $2 + 1 | 0 : $2;
         }
         $2 = $23 - 1 | 0;
         $22 = $2 + 1 | 0;
         $6 = $2;
         $2 = $8 - 256 | 0;
         $8 = $2 >>> 0 < 4294967040 ? $22 : $6;
         $6 = $8 >>> 4 | 0;
         $23 = ($8 & 15) << 28 | $2 >>> 4;
         $24 = ($8 | 0) != 0;
         $22 = !$8;
         block34 : {
          if (!($24 | $22 & $2 >>> 0 > 63)) {
           $34 = $3 + 2 | 0;
           $14 = $34 >>> 0 < 2 ? $12 + 1 | 0 : $12;
           block38 : {
            block36 : {
             if ($25 | $27) {
              if (!($24 | $2 >>> 0 >= 16 & $22)) {
               $12 = $29;
               $23 = $31;
               $6 = $20;
               $8 = $21;
               $22 = $19;
               $24 = $17;
               $3 = $26;
               $2 = $30;
               break block34;
              }
              $2 = $6 - 1 | 0;
              $15 = $23 - 1 | 0;
              $2 = ($15 | 0) != -1 ? $2 + 1 | 0 : $2;
              if (!$2 & $15 >>> 0 > 1 | $2) {
               break block35
              }
              $12 = $29;
              $23 = $31;
              $6 = $26;
              $8 = $30;
              $22 = $19;
              $24 = $17;
              $3 = $20;
              $2 = $21;
              if ($15 - 1 | 0) {
               break block34
              }
              break block36;
             }
             if (!(!$8 & $2 >>> 0 >= 16 | ($8 | 0) != 0)) {
              $12 = $29;
              $23 = $31;
              $6 = $20;
              $8 = $21;
              $22 = $26;
              $24 = $30;
              $3 = $19;
              $2 = $17;
              break block34;
             }
             $2 = $6 - 1 | 0;
             $15 = $23 - 1 | 0;
             if (!(($15 | 0) != -1 ? $2 + 1 | 0 : $2) & $15 >>> 0 <= 1) {
              break block38
             }
            }
            $12 = $20;
            $23 = $21;
            $6 = $26;
            $8 = $30;
            $22 = $19;
            $24 = $17;
            $3 = $29;
            $2 = $31;
            break block34;
           }
           $12 = $29;
           $23 = $31;
           $6 = $20;
           $8 = $21;
           $22 = $19;
           $24 = $17;
           $3 = $26;
           $2 = $30;
           if ($15 - 1 | 0) {
            break block34
           }
           $6 = $3;
           $8 = $2;
           $3 = $20;
           $2 = $21;
           break block34;
          }
          $2 = $6 - 1 | 0;
          $8 = $23 - 4 | 0;
          $23 = $8 >>> 0 < 4294967292 ? $2 + 1 | 0 : $2;
          if (!$23 & $8 >>> 0 >= 33 | $23) {
           break block28
          }
          $24 = $8 << 3;
          $2 = $24 + 6656 | 0;
          $22 = $5 & HEAP32[$2 >> 2];
          $29 = $4 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $4 >>> $2 | 0;
          } else {
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
          }
          $4 = $6;
          $2 = $7;
          $7 = $2 - $8 | 0;
          $9 = $9 - (($2 >>> 0 < $8 >>> 0) + $23 | 0) | 0;
          if (($9 | 0) < 0) {
           $8 = HEAP32[$18 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $8 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
            $2 = $8 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $18 = $18 + 4 | 0;
           $5 = $2;
          }
          $34 = $3 + 4 | 0;
          $14 = $34 >>> 0 < 4 ? $12 + 1 | 0 : $12;
          $2 = $24 + 6400 | 0;
          $3 = HEAP32[$2 >> 2];
          $2 = $29 + HEAP32[$2 + 4 >> 2] | 0;
          $3 = $3 + $22 | 0;
          $2 = $3 >>> 0 < $22 >>> 0 ? $2 + 1 | 0 : $2;
          $12 = $20;
          $23 = $21;
          $6 = $26;
          $8 = $30;
          $22 = $19;
          $24 = $17;
         }
         if (!(($2 | 0) == ($16 | 0) & $3 >>> 0 <= $13 >>> 0 | $2 >>> 0 < $16 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 - -64 | 0;
          HEAP32[$4 >> 2] = $3;
          HEAP32[$4 + 4 >> 2] = $2;
          HEAP32[$11 + 56 >> 2] = $5;
          HEAP32[$11 + 60 >> 2] = $1;
          HEAP32[$11 + 48 >> 2] = $13;
          HEAP32[$11 + 52 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $10 = 0 - $3 | 0;
         $15 = 0 - ((($3 | 0) != 0) + $2 | 0) | 0;
         $20 = $14 + $16 | 0;
         $17 = $20 + 1 | 0;
         $21 = $20;
         $20 = $13 + $34 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $17 : $21;
         if (!(($28 | 0) == ($19 | 0) & $20 >>> 0 <= $35 >>> 0 | $19 >>> 0 < $28 >>> 0)) {
          $25 = 1;
          $27 = 0;
          break block8;
         }
         $21 = $10;
         $17 = $10 + $33 | 0;
         HEAP8[$13 + $33 | 0] = HEAPU8[$17 + $13 | 0];
         $26 = $13 + 1 | 0;
         HEAP8[$26 + $33 | 0] = HEAPU8[$17 + $26 | 0];
         $25 = $13 + 2 | 0;
         $27 = $25 >>> 0 < 2 ? $16 + 1 | 0 : $16;
         block44 : {
          if (!(($19 | 0) == ($27 | 0) & $20 >>> 0 > $25 >>> 0 | $19 >>> 0 > $27 >>> 0)) {
           $13 = $25;
           $19 = $27;
           break block44;
          }
          $17 = $14 - 1 | 0;
          $26 = $34 - 3 | 0;
          $30 = $26 >>> 0 < 4294967293 ? $17 + 1 | 0 : $17;
          $17 = $34 & 3 ^ 2;
          if ($17) {
           $10 = 0;
           $15 = 0;
           $29 = 0 - $17 | 0;
           $17 = 0 - (($17 | 0) != 0) | 0;
           while (1) {
            HEAP8[$37 | 0] = HEAPU8[$21 + $37 | 0];
            $37 = $37 + 1 | 0;
            $31 = $15 - 1 | 0;
            $10 = $10 - 1 | 0;
            $15 = ($10 | 0) != -1 ? $31 + 1 | 0 : $31;
            if (($10 | 0) != ($29 | 0) | ($15 | 0) != ($17 | 0)) {
             continue
            }
            break;
           };
           $17 = $16 - (($10 >>> 0 > $13 >>> 0) + $15 | 0) | 0;
           $25 = ($13 - $10 | 0) + 2 | 0;
           $27 = $25 >>> 0 < 2 ? $17 + 1 | 0 : $17;
          }
          if (!(!$30 & $26 >>> 0 < 3)) {
           $10 = $25 - $34 | 0;
           $15 = $27 - (($25 >>> 0 < $34 >>> 0) + $14 | 0) | 0;
           $14 = $25 + $33 | 0;
           while (1) {
            $17 = $14 + $21 | 0;
            HEAP8[$14 | 0] = HEAPU8[$17 | 0];
            HEAP8[$14 + 1 | 0] = HEAPU8[$17 + 1 | 0];
            HEAP8[$14 + 2 | 0] = HEAPU8[$17 + 2 | 0];
            HEAP8[$14 + 3 | 0] = HEAPU8[$17 + 3 | 0];
            $14 = $14 + 4 | 0;
            $10 = $10 + 4 | 0;
            $15 = $10 >>> 0 < 4 ? $15 + 1 | 0 : $15;
            if (($10 | 0) != ($13 | 0) | ($15 | 0) != ($16 | 0)) {
             continue
            }
            break;
           };
          }
          $13 = $20;
         }
         $16 = $19;
         $25 = 1;
         $27 = 0;
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
          continue
         }
         break;
        };
       }
       HEAP32[$1 + 248 >> 2] = 0;
       HEAP32[$1 + 252 >> 2] = 0;
       break block47;
      }
      HEAP32[$0 >> 2] = 9;
      HEAP32[$11 + 80 >> 2] = $13;
      HEAP32[$11 + 84 >> 2] = $16;
      HEAP8[$0 + 16 | 0] = 0;
      break block2;
     }
     wasm2js_trap();
    }
    $14 = $13 + $33 | 0;
    while (1) {
     HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
     $14 = $14 + 1 | 0;
     $13 = $13 + 1 | 0;
     $16 = $13 ? $16 : $16 + 1 | 0;
     if (($28 | 0) == ($16 | 0) & $13 >>> 0 < $35 >>> 0 | $16 >>> 0 < $28 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $10;
    HEAP32[$0 + 4 >> 2] = $15;
    HEAP32[$1 + 248 >> 2] = $20 - $35;
    HEAP32[$1 + 252 >> 2] = $19 - (($20 >>> 0 < $35 >>> 0) + $28 | 0);
   }
   HEAP32[$1 + 240 >> 2] = $12;
   HEAP32[$1 + 244 >> 2] = $23;
   HEAP32[$1 + 232 >> 2] = $6;
   HEAP32[$1 + 236 >> 2] = $8;
   HEAP32[$1 + 224 >> 2] = $22;
   HEAP32[$1 + 228 >> 2] = $24;
   HEAP32[$1 + 216 >> 2] = $3;
   HEAP32[$1 + 220 >> 2] = $2;
   HEAP32[$1 + 208 >> 2] = $25;
   HEAP32[$1 + 212 >> 2] = $27;
   HEAP32[$1 + 200 >> 2] = $18;
   HEAP32[$1 + 192 >> 2] = $7;
   HEAP32[$1 + 196 >> 2] = $9;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $4;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $16;
  }
  __stack_pointer = $11 + 272 | 0;
 }
 
 function Xpress9Lz77Dec_MtfCount4_Ptr4_Mtf3($0, $1) {
  $0 = $0 | 0;
  $1 = $1 | 0;
  var $2 = 0, $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0, $18 = 0, $19 = 0, $20 = 0, $21 = 0, $22 = 0, $23 = 0, $24 = 0, $25 = 0, $26 = 0, $27 = 0, $28 = 0, $29 = 0, $30 = 0, $31 = 0, $32 = 0, $33 = 0, $34 = 0, $35 = 0, $36 = 0, $37 = 0, $38 = 0, $39 = 0, $40 = 0;
  $11 = __stack_pointer - 272 | 0;
  __stack_pointer = $11;
  $5 = $1 - -64 | 0;
  $35 = HEAP32[$5 >> 2];
  $28 = HEAP32[$5 + 4 >> 2];
  $5 = $1 + 48 | 0;
  $13 = HEAP32[$5 >> 2];
  $4 = $1 + 56 | 0;
  $36 = HEAP32[$4 >> 2];
  block2 : {
   block1 : {
    $16 = HEAP32[$5 + 4 >> 2];
    $2 = $16;
    $32 = HEAP32[$4 + 4 >> 2];
    $5 = $32;
    if (!(($2 | 0) == ($5 | 0) & $13 >>> 0 >= $36 >>> 0 | $2 >>> 0 > $5 >>> 0)) {
     if (($5 | 0) == ($28 | 0) & $35 >>> 0 >= $36 >>> 0 | $5 >>> 0 < $28 >>> 0) {
      break block1
     }
    }
    HEAP32[$0 >> 2] = 3;
    $1 = $11 + 40 | 0;
    HEAP32[$1 >> 2] = $35;
    HEAP32[$1 + 4 >> 2] = $28;
    $1 = $11 + 32 | 0;
    HEAP32[$1 >> 2] = $36;
    HEAP32[$1 + 4 >> 2] = $32;
    $1 = $11 + 24 | 0;
    HEAP32[$1 >> 2] = $13;
    HEAP32[$1 + 4 >> 2] = $16;
    HEAP32[$11 + 12 >> 2] = 42;
    HEAP32[$11 + 16 >> 2] = 0;
    HEAP32[$11 + 8 >> 2] = 3772;
    HEAP32[$11 + 4 >> 2] = 4993;
    HEAP32[$11 >> 2] = 3492;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 144 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 256 >> 2] = 4;
    $1 = $11 + 248 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 236 >> 2] = 50;
    HEAP32[$11 + 240 >> 2] = 0;
    HEAP32[$11 + 232 >> 2] = 3772;
    HEAP32[$11 + 228 >> 2] = 4993;
    HEAP32[$11 + 224 >> 2] = 4787;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 160 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 3)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 208 >> 2] = 3;
    $1 = $11 + 200 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 188 >> 2] = 58;
    HEAP32[$11 + 192 >> 2] = 0;
    HEAP32[$11 + 184 >> 2] = 3772;
    HEAP32[$11 + 180 >> 2] = 4993;
    HEAP32[$11 + 176 >> 2] = 4714;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $4 = $1 + 152 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   if (!(!$4 & ($5 | 0) == 4)) {
    HEAP32[$0 >> 2] = 3;
    HEAP32[$11 + 160 >> 2] = 4;
    $1 = $11 + 152 | 0;
    HEAP32[$1 >> 2] = $5;
    HEAP32[$1 + 4 >> 2] = $4;
    HEAP32[$11 + 140 >> 2] = 66;
    HEAP32[$11 + 144 >> 2] = 0;
    HEAP32[$11 + 136 >> 2] = 3772;
    HEAP32[$11 + 132 >> 2] = 4993;
    HEAP32[$11 + 128 >> 2] = 4641;
    HEAP8[$0 + 16 | 0] = 0;
    break block2;
   }
   $38 = HEAP32[$1 + 176 >> 2];
   $39 = HEAP32[$1 + 172 >> 2];
   $5 = $1 + 240 | 0;
   $12 = HEAP32[$5 >> 2];
   $23 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 232 | 0;
   $6 = HEAP32[$5 >> 2];
   $8 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 224 | 0;
   $22 = HEAP32[$5 >> 2];
   $24 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 216 | 0;
   $3 = HEAP32[$5 >> 2];
   $2 = HEAP32[$5 + 4 >> 2];
   $5 = $1 + 208 | 0;
   $25 = HEAP32[$5 >> 2];
   $27 = HEAP32[$5 + 4 >> 2];
   $33 = HEAP32[$1 + 264 >> 2];
   $18 = HEAP32[$1 + 200 >> 2];
   $5 = $1 + 192 | 0;
   $7 = HEAP32[$5 >> 2];
   $9 = HEAP32[$5 + 4 >> 2];
   $4 = $1 + 184 | 0;
   $5 = HEAP32[$4 >> 2];
   $4 = HEAP32[$4 + 4 >> 2];
   $21 = $1 + 248 | 0;
   $20 = HEAP32[$21 >> 2];
   $21 = HEAP32[$21 + 4 >> 2];
   $17 = $21;
   block47 : {
    block8 : {
     block28 : {
      block35 : {
       block9 : {
        if ($20 | $17) {
         $19 = $1 + 256 | 0;
         $10 = HEAP32[$19 >> 2];
         $21 = 0 - $10 | 0;
         $15 = HEAP32[$19 + 4 >> 2];
         $19 = 0 - ($15 + (($10 | 0) != 0) | 0) | 0;
         if (!(($19 | 0) == ($16 | 0) & $13 >>> 0 >= $21 >>> 0 | $16 >>> 0 > $19 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 + 112 | 0;
          HEAP32[$4 >> 2] = $21;
          HEAP32[$4 + 4 >> 2] = $19;
          HEAP32[$11 + 104 >> 2] = $5;
          HEAP32[$11 + 108 >> 2] = $1;
          HEAP32[$11 + 96 >> 2] = $13;
          HEAP32[$11 + 100 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $21 = $16 + $17 | 0;
         $20 = $13 + $20 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $21 + 1 | 0 : $21;
         if (($28 | 0) == ($19 | 0) & $20 >>> 0 > $35 >>> 0 | $19 >>> 0 > $28 >>> 0) {
          break block8
         }
         $14 = $13 + $33 | 0;
         while (1) {
          HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
          $14 = $14 + 1 | 0;
          $13 = $13 + 1 | 0;
          $16 = $13 ? $16 : $16 + 1 | 0;
          if (($19 | 0) == ($16 | 0) & $13 >>> 0 < $20 >>> 0 | $16 >>> 0 < $19 >>> 0) {
           continue
          }
          break;
         };
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 >= $36 >>> 0 | $16 >>> 0 > $32 >>> 0) {
          break block9
         }
        }
        $40 = $33 + 2 | 0;
        while (1) {
         $19 = $3;
         $17 = $2;
         $26 = $22;
         $30 = $24;
         $20 = $6;
         $21 = $8;
         $29 = $12;
         $31 = $23;
         $37 = $13 + $40 | 0;
         block17 : {
          while (1) {
           $12 = HEAP16[(($5 & 4095) << 1) + $39 >> 1];
           $10 = $12;
           $15 = $10 >> 31;
           block11 : {
            if (($10 | 0) >= 0) {
             $2 = $18;
             break block11;
            }
            $3 = $10 & 15;
            $2 = $3;
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
            $4 = $6;
            $2 = $7;
            $7 = $2 - $3 | 0;
            $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
            $9 = $2;
            block13 : {
             if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
              $2 = $18;
              break block13;
             }
             $2 = $18 + 4 | 0;
             $8 = HEAP32[$18 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $8 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
              $3 = $8 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $5 = $3;
            }
            $18 = (($12 & 2147483632) << 1) + $39 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) >= 0) {
             break block11
            }
            while (1) {
             $8 = $10 & 15;
             $3 = $8;
             $6 = $4 >>> $3 | 0;
             $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
             $4 = $6;
             $3 = $7;
             $7 = $3 - $8 | 0;
             $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
             if (($9 | 0) < 0) {
              $8 = HEAP32[$2 >> 2];
              $7 = $7 + 32 | 0;
              $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
              $3 = $7 & 31;
              if (($7 & 63) >>> 0 >= 32) {
               $6 = $8 << $3;
               $3 = 0;
              } else {
               $6 = (1 << $3) - 1 & $8 >>> 32 - $3;
               $3 = $8 << $3;
              }
              $3 = $3 + $5 | 0;
              $4 = $4 + $6 | 0;
              $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
              $2 = $2 + 4 | 0;
              $5 = $3;
             }
             $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
             $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
             $10 = $14;
             $15 = $10 >> 31;
             if (($10 | 0) < 0) {
              continue
             }
             break;
            };
           }
           $8 = $10 & 15;
           $3 = $8;
           $6 = $4 >>> $3 | 0;
           $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
           $4 = $6;
           $3 = $7;
           $7 = $3 - $8 | 0;
           $9 = $9 - ($3 >>> 0 < $8 >>> 0) | 0;
           if (($9 | 0) < -1) {
            $3 = 1
           } else {
            $3 = ($9 | 0) < 0
           }
           block16 : {
            if (!$3) {
             $18 = $2;
             break block16;
            }
            $18 = $2 + 4 | 0;
            $3 = HEAP32[$2 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $8 = ($15 & 15) << 28 | $10 >>> 4;
           $23 = $15 >>> 4 | 0;
           if (!$15 & $10 >>> 0 > 4095 | $15) {
            break block17
           }
           HEAP8[$13 + $33 | 0] = $8;
           $37 = $37 + 1 | 0;
           $25 = 0;
           $27 = 0;
           $13 = $13 + 1 | 0;
           $16 = $13 ? $16 : $16 + 1 | 0;
           if (($32 | 0) == ($16 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
            continue
           }
           break;
          };
          $12 = $29;
          $23 = $31;
          $6 = $20;
          $8 = $21;
          $22 = $26;
          $24 = $30;
          $3 = $19;
          $2 = $17;
          break block9;
         }
         $3 = $8 & 15;
         if (($3 | 0) != 15) {
          $12 = 0
         } else {
          $22 = HEAP16[(($5 & 4095) << 1) + $38 >> 1];
          $10 = $22;
          $15 = $10 >> 31;
          block20 : {
           if (($10 | 0) >= 0) {
            $2 = $18;
            break block20;
           }
           $3 = $10 & 15;
           $2 = $3;
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - ($2 >>> 0 < $3 >>> 0) | 0;
           $9 = $2;
           block22 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $2 = $18;
             break block22;
            }
            $2 = $18 + 4 | 0;
            $12 = HEAP32[$18 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $3 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $12 << $3;
             $3 = 0;
            } else {
             $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
             $3 = $12 << $3;
            }
            $3 = $3 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $3;
           }
           $18 = (($22 & 2147483632) << 1) + $38 | 0;
           $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
           $10 = $14;
           $15 = $10 >> 31;
           if (($10 | 0) >= 0) {
            break block20
           }
           while (1) {
            $12 = $10 & 15;
            $3 = $12;
            $6 = $4 >>> $3 | 0;
            $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
            $4 = $6;
            $3 = $7;
            $7 = $3 - $12 | 0;
            $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
            if (($9 | 0) < 0) {
             $12 = HEAP32[$2 >> 2];
             $7 = $7 + 32 | 0;
             $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
             $3 = $7 & 31;
             if (($7 & 63) >>> 0 >= 32) {
              $6 = $12 << $3;
              $3 = 0;
             } else {
              $6 = (1 << $3) - 1 & $12 >>> 32 - $3;
              $3 = $12 << $3;
             }
             $3 = $3 + $5 | 0;
             $4 = $4 + $6 | 0;
             $4 = $3 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
             $2 = $2 + 4 | 0;
             $5 = $3;
            }
            $18 = (($14 & 65520) << 16 >> 16 << 1) + $18 | 0;
            $14 = HEAP16[$18 + (($5 & 63) << 1) >> 1];
            $10 = $14;
            $15 = $10 >> 31;
            if (($10 | 0) < 0) {
             continue
            }
            break;
           };
          }
          $12 = $10 & 15;
          $3 = $12;
          $6 = $4 >>> $3 | 0;
          $5 = ((1 << $3) - 1 & $4) << 32 - $3 | $5 >>> $3;
          $4 = $6;
          $3 = $7;
          $7 = $3 - $12 | 0;
          $9 = $9 - ($3 >>> 0 < $12 >>> 0) | 0;
          if (($9 | 0) < -1) {
           $3 = 1
          } else {
           $3 = ($9 | 0) < 0
          }
          block25 : {
           if (!$3) {
            $14 = $2;
            break block25;
           }
           $14 = $2 + 4 | 0;
           $3 = HEAP32[$2 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $3 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
            $2 = $3 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $5 = $2;
          }
          $3 = ($15 & 15) << 28 | $10 >>> 4;
          $2 = $15 >>> 4 | 0;
          block27 : {
           if (!(!$15 & $10 >>> 0 >= 3712 | ($15 | 0) != 0)) {
            $18 = $14;
            break block27;
           }
           $2 = $2 - 1 | 0;
           $3 = $3 - 232 | 0;
           $12 = $3 >>> 0 < 4294967064 ? $2 + 1 | 0 : $2;
           if (!$12 & $3 >>> 0 >= 33 | $12) {
            break block28
           }
           $22 = $3 << 3;
           $2 = $22 + 6656 | 0;
           $24 = $5 & HEAP32[$2 >> 2];
           $15 = $4 & HEAP32[$2 + 4 >> 2];
           $2 = $3 & 31;
           if (($3 & 63) >>> 0 >= 32) {
            $6 = 0;
            $5 = $4 >>> $2 | 0;
           } else {
            $6 = $4 >>> $2 | 0;
            $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
           }
           $4 = $6;
           $2 = $7;
           $7 = $2 - $3 | 0;
           $2 = $9 - (($2 >>> 0 < $3 >>> 0) + $12 | 0) | 0;
           $9 = $2;
           block30 : {
            if (!(($2 | 0) < 0 | ($2 | 0) < -1)) {
             $18 = $14;
             break block30;
            }
            $18 = $14 + 4 | 0;
            $3 = HEAP32[$14 >> 2];
            $7 = $7 + 32 | 0;
            $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
            $2 = $7 & 31;
            if (($7 & 63) >>> 0 >= 32) {
             $6 = $3 << $2;
             $2 = 0;
            } else {
             $6 = (1 << $2) - 1 & $3 >>> 32 - $2;
             $2 = $3 << $2;
            }
            $2 = $2 + $5 | 0;
            $4 = $4 + $6 | 0;
            $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
            $5 = $2;
           }
           $3 = $22 + 6400 | 0;
           $6 = HEAP32[$3 >> 2];
           $2 = $6 + $24 | 0;
           $3 = HEAP32[$3 + 4 >> 2] + $15 | 0;
           $3 = $2 >>> 0 < $6 >>> 0 ? $3 + 1 | 0 : $3;
           $12 = $3 + 1 | 0;
           $6 = $3;
           $3 = $2 + 231 | 0;
           $2 = $3 >>> 0 < 231 ? $12 : $6;
          }
          $3 = $3 + 15 | 0;
          $12 = $3 >>> 0 < 15 ? $2 + 1 | 0 : $2;
         }
         $2 = $23 - 1 | 0;
         $22 = $2 + 1 | 0;
         $6 = $2;
         $2 = $8 - 256 | 0;
         $8 = $2 >>> 0 < 4294967040 ? $22 : $6;
         $6 = $8 >>> 4 | 0;
         $23 = ($8 & 15) << 28 | $2 >>> 4;
         $24 = ($8 | 0) != 0;
         $22 = !$8;
         block34 : {
          if (!($24 | $22 & $2 >>> 0 > 63)) {
           $34 = $3 + 3 | 0;
           $14 = $34 >>> 0 < 3 ? $12 + 1 | 0 : $12;
           block38 : {
            block36 : {
             if ($25 | $27) {
              if (!($24 | $2 >>> 0 >= 16 & $22)) {
               $12 = $29;
               $23 = $31;
               $6 = $20;
               $8 = $21;
               $22 = $19;
               $24 = $17;
               $3 = $26;
               $2 = $30;
               break block34;
              }
              $2 = $6 - 1 | 0;
              $15 = $23 - 1 | 0;
              $2 = ($15 | 0) != -1 ? $2 + 1 | 0 : $2;
              if (!$2 & $15 >>> 0 > 1 | $2) {
               break block35
              }
              $12 = $29;
              $23 = $31;
              $6 = $26;
              $8 = $30;
              $22 = $19;
              $24 = $17;
              $3 = $20;
              $2 = $21;
              if ($15 - 1 | 0) {
               break block34
              }
              break block36;
             }
             if (!(!$8 & $2 >>> 0 >= 16 | ($8 | 0) != 0)) {
              $12 = $29;
              $23 = $31;
              $6 = $20;
              $8 = $21;
              $22 = $26;
              $24 = $30;
              $3 = $19;
              $2 = $17;
              break block34;
             }
             $2 = $6 - 1 | 0;
             $15 = $23 - 1 | 0;
             if (!(($15 | 0) != -1 ? $2 + 1 | 0 : $2) & $15 >>> 0 <= 1) {
              break block38
             }
            }
            $12 = $20;
            $23 = $21;
            $6 = $26;
            $8 = $30;
            $22 = $19;
            $24 = $17;
            $3 = $29;
            $2 = $31;
            break block34;
           }
           $12 = $29;
           $23 = $31;
           $6 = $20;
           $8 = $21;
           $22 = $19;
           $24 = $17;
           $3 = $26;
           $2 = $30;
           if ($15 - 1 | 0) {
            break block34
           }
           $6 = $3;
           $8 = $2;
           $3 = $20;
           $2 = $21;
           break block34;
          }
          $2 = $6 - 1 | 0;
          $8 = $23 - 4 | 0;
          $23 = $8 >>> 0 < 4294967292 ? $2 + 1 | 0 : $2;
          if (!$23 & $8 >>> 0 >= 33 | $23) {
           break block28
          }
          $24 = $8 << 3;
          $2 = $24 + 6656 | 0;
          $22 = $5 & HEAP32[$2 >> 2];
          $29 = $4 & HEAP32[$2 + 4 >> 2];
          $2 = $8 & 31;
          if (($8 & 63) >>> 0 >= 32) {
           $6 = 0;
           $5 = $4 >>> $2 | 0;
          } else {
           $6 = $4 >>> $2 | 0;
           $5 = ((1 << $2) - 1 & $4) << 32 - $2 | $5 >>> $2;
          }
          $4 = $6;
          $2 = $7;
          $7 = $2 - $8 | 0;
          $9 = $9 - (($2 >>> 0 < $8 >>> 0) + $23 | 0) | 0;
          if (($9 | 0) < 0) {
           $8 = HEAP32[$18 >> 2];
           $7 = $7 + 32 | 0;
           $9 = $7 >>> 0 < 32 ? $9 + 1 | 0 : $9;
           $2 = $7 & 31;
           if (($7 & 63) >>> 0 >= 32) {
            $6 = $8 << $2;
            $2 = 0;
           } else {
            $6 = (1 << $2) - 1 & $8 >>> 32 - $2;
            $2 = $8 << $2;
           }
           $2 = $2 + $5 | 0;
           $4 = $4 + $6 | 0;
           $4 = $2 >>> 0 < $5 >>> 0 ? $4 + 1 | 0 : $4;
           $18 = $18 + 4 | 0;
           $5 = $2;
          }
          $34 = $3 + 4 | 0;
          $14 = $34 >>> 0 < 4 ? $12 + 1 | 0 : $12;
          $2 = $24 + 6400 | 0;
          $3 = HEAP32[$2 >> 2];
          $2 = $29 + HEAP32[$2 + 4 >> 2] | 0;
          $3 = $3 + $22 | 0;
          $2 = $3 >>> 0 < $22 >>> 0 ? $2 + 1 | 0 : $2;
          $12 = $20;
          $23 = $21;
          $6 = $26;
          $8 = $30;
          $22 = $19;
          $24 = $17;
         }
         if (!(($2 | 0) == ($16 | 0) & $3 >>> 0 <= $13 >>> 0 | $2 >>> 0 < $16 >>> 0)) {
          HEAP32[$0 >> 2] = 9;
          $5 = HEAP32[$1 + 40 >> 2];
          $1 = HEAP32[$1 + 44 >> 2];
          $4 = $11 - -64 | 0;
          HEAP32[$4 >> 2] = $3;
          HEAP32[$4 + 4 >> 2] = $2;
          HEAP32[$11 + 56 >> 2] = $5;
          HEAP32[$11 + 60 >> 2] = $1;
          HEAP32[$11 + 48 >> 2] = $13;
          HEAP32[$11 + 52 >> 2] = $16;
          HEAP8[$0 + 16 | 0] = 0;
          break block2;
         }
         $10 = 0 - $3 | 0;
         $15 = 0 - ((($3 | 0) != 0) + $2 | 0) | 0;
         $20 = $14 + $16 | 0;
         $17 = $20 + 1 | 0;
         $21 = $20;
         $20 = $13 + $34 | 0;
         $19 = $20 >>> 0 < $13 >>> 0 ? $17 : $21;
         if (!(($28 | 0) == ($19 | 0) & $20 >>> 0 <= $35 >>> 0 | $19 >>> 0 < $28 >>> 0)) {
          $25 = 1;
          $27 = 0;
          break block8;
         }
         $21 = $10;
         $17 = $10 + $33 | 0;
         HEAP8[$13 + $33 | 0] = HEAPU8[$17 + $13 | 0];
         $26 = $13 + 1 | 0;
         HEAP8[$26 + $33 | 0] = HEAPU8[$17 + $26 | 0];
         $25 = $13 + 2 | 0;
         $27 = $25 >>> 0 < 2 ? $16 + 1 | 0 : $16;
         block44 : {
          if (!(($19 | 0) == ($27 | 0) & $20 >>> 0 > $25 >>> 0 | $19 >>> 0 > $27 >>> 0)) {
           $13 = $25;
           $19 = $27;
           break block44;
          }
          $17 = $14 - 1 | 0;
          $26 = $34 - 3 | 0;
          $30 = $26 >>> 0 < 4294967293 ? $17 + 1 | 0 : $17;
          $17 = $34 & 3 ^ 2;
          if ($17) {
           $10 = 0;
           $15 = 0;
           $29 = 0 - $17 | 0;
           $17 = 0 - (($17 | 0) != 0) | 0;
           while (1) {
            HEAP8[$37 | 0] = HEAPU8[$21 + $37 | 0];
            $37 = $37 + 1 | 0;
            $31 = $15 - 1 | 0;
            $10 = $10 - 1 | 0;
            $15 = ($10 | 0) != -1 ? $31 + 1 | 0 : $31;
            if (($10 | 0) != ($29 | 0) | ($15 | 0) != ($17 | 0)) {
             continue
            }
            break;
           };
           $17 = $16 - (($10 >>> 0 > $13 >>> 0) + $15 | 0) | 0;
           $25 = ($13 - $10 | 0) + 2 | 0;
           $27 = $25 >>> 0 < 2 ? $17 + 1 | 0 : $17;
          }
          if (!(!$30 & $26 >>> 0 < 3)) {
           $10 = $25 - $34 | 0;
           $15 = $27 - (($25 >>> 0 < $34 >>> 0) + $14 | 0) | 0;
           $14 = $25 + $33 | 0;
           while (1) {
            $17 = $14 + $21 | 0;
            HEAP8[$14 | 0] = HEAPU8[$17 | 0];
            HEAP8[$14 + 1 | 0] = HEAPU8[$17 + 1 | 0];
            HEAP8[$14 + 2 | 0] = HEAPU8[$17 + 2 | 0];
            HEAP8[$14 + 3 | 0] = HEAPU8[$17 + 3 | 0];
            $14 = $14 + 4 | 0;
            $10 = $10 + 4 | 0;
            $15 = $10 >>> 0 < 4 ? $15 + 1 | 0 : $15;
            if (($10 | 0) != ($13 | 0) | ($15 | 0) != ($16 | 0)) {
             continue
            }
            break;
           };
          }
          $13 = $20;
         }
         $16 = $19;
         $25 = 1;
         $27 = 0;
         if (($16 | 0) == ($32 | 0) & $13 >>> 0 < $36 >>> 0 | $16 >>> 0 < $32 >>> 0) {
          continue
         }
         break;
        };
       }
       HEAP32[$1 + 248 >> 2] = 0;
       HEAP32[$1 + 252 >> 2] = 0;
       break block47;
      }
      HEAP32[$0 >> 2] = 9;
      HEAP32[$11 + 80 >> 2] = $13;
      HEAP32[$11 + 84 >> 2] = $16;
      HEAP8[$0 + 16 | 0] = 0;
      break block2;
     }
     wasm2js_trap();
    }
    $14 = $13 + $33 | 0;
    while (1) {
     HEAP8[$14 | 0] = HEAPU8[$10 + $14 | 0];
     $14 = $14 + 1 | 0;
     $13 = $13 + 1 | 0;
     $16 = $13 ? $16 : $16 + 1 | 0;
     if (($28 | 0) == ($16 | 0) & $13 >>> 0 < $35 >>> 0 | $16 >>> 0 < $28 >>> 0) {
      continue
     }
     break;
    };
    $0 = $1 + 256 | 0;
    HEAP32[$0 >> 2] = $10;
    HEAP32[$0 + 4 >> 2] = $15;
    HEAP32[$1 + 248 >> 2] = $20 - $35;
    HEAP32[$1 + 252 >> 2] = $19 - (($20 >>> 0 < $35 >>> 0) + $28 | 0);
   }
   HEAP32[$1 + 240 >> 2] = $12;
   HEAP32[$1 + 244 >> 2] = $23;
   HEAP32[$1 + 232 >> 2] = $6;
   HEAP32[$1 + 236 >> 2] = $8;
   HEAP32[$1 + 224 >> 2] = $22;
   HEAP32[$1 + 228 >> 2] = $24;
   HEAP32[$1 + 216 >> 2] = $3;
   HEAP32[$1 + 220 >> 2] = $2;
   HEAP32[$1 + 208 >> 2] = $25;
   HEAP32[$1 + 212 >> 2] = $27;
   HEAP32[$1 + 200 >> 2] = $18;
   HEAP32[$1 + 192 >> 2] = $7;
   HEAP32[$1 + 196 >> 2] = $9;
   HEAP32[$1 + 184 >> 2] = $5;
   HEAP32[$1 + 188 >> 2] = $4;
   HEAP32[$1 + 48 >> 2] = $13;
   HEAP32[$1 + 52 >> 2] = $16;
  }
  __stack_pointer = $11 + 272 | 0;
 }
 
 function HuffmanReverseMask($0, $1, $2, $3) {
  var $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0, $12 = 0, $13 = 0, $14 = 0, $15 = 0, $16 = 0, $17 = 0;
  $4 = $2 & 31;
  block1 : {
   block3 : {
    block2 : {
     if (($2 & 63) >>> 0 >= 32) {
      $4 = $1 >>> $4 | 0
     } else {
      $8 = $1 >>> $4 | 0;
      $4 = ((1 << $4) - 1 & $1) << 32 - $4 | $0 >>> $4;
     }
     if (!($4 | $8)) {
      if (!$3 & $2 >>> 0 < 6) {
       break block1
      }
      $4 = $3 - 1 | 0;
      $5 = $2 - 6 | 0;
      $4 = $5 >>> 0 < 4294967290 ? $4 + 1 | 0 : $4;
      $8 = _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E($5, $4, 6);
      $6 = i64toi32_i32$HIGH_BITS;
      $7 = $6;
      $9 = $6 + 1 | 0;
      $6 = $8 + 1 | 0;
      $7 = $6 ? $7 : $9;
      $9 = $6 & 3;
      $8 = 0;
      if (!$4 & $5 >>> 0 >= 18 | $4) {
       break block2
      }
      $5 = 0;
      $6 = 0;
      break block3;
     }
     wasm2js_trap();
    }
    $11 = $6 & -4;
    $4 = $7 & 2147483647;
    $5 = 0;
    $6 = 0;
    while (1) {
     $7 = HEAPU8[($0 & 63) + 6912 | 0];
     $16 = $7 >>> 26 | 0;
     $10 = HEAPU8[($0 >>> 12 & 63) + 6912 | 0];
     $17 = $10 >>> 26 | 0;
     $12 = $10 << 6;
     $13 = $7 << 6;
     $14 = $13 + ($5 << 12) | 0;
     $15 = HEAPU8[($0 >>> 6 & 63) + 6912 | 0];
     $7 = $14 + $15 | 0;
     $10 = $12 + ($7 << 12) | 0;
     $5 = $16 + ($6 << 12 | $5 >>> 20) | 0;
     $5 = $13 >>> 0 > $14 >>> 0 ? $5 + 1 | 0 : $5;
     $5 = $17 + (($7 >>> 0 < $15 >>> 0 ? $5 + 1 | 0 : $5) << 12 | $7 >>> 20) | 0;
     $5 = $10 >>> 0 < $12 >>> 0 ? $5 + 1 | 0 : $5;
     $12 = $5 + 1 | 0;
     $7 = $5;
     $6 = HEAPU8[($0 >>> 18 & 63) + 6912 | 0];
     $5 = $10 + $6 | 0;
     $6 = $5 >>> 0 < $6 >>> 0 ? $12 : $7;
     $3 = $3 - 1 | 0;
     $2 = $2 - 24 | 0;
     $3 = $2 >>> 0 < 4294967272 ? $3 + 1 | 0 : $3;
     $0 = ($1 & 16777215) << 8 | $0 >>> 24;
     $1 = $1 >>> 24 | 0;
     $4 = $4 - 1 | 0;
     $11 = $11 - 4 | 0;
     $4 = $11 >>> 0 < 4294967292 ? $4 + 1 | 0 : $4;
     if ($4 | $11) {
      continue
     }
     break;
    };
   }
   if (!$9) {
    break block1
   }
   while (1) {
    $4 = $6 << 6 | $5 >>> 26;
    $7 = $4 + 1 | 0;
    $6 = $4;
    $4 = HEAPU8[($0 & 63) + 6912 | 0];
    $5 = $4 + ($5 << 6) | 0;
    $6 = $5 >>> 0 < $4 >>> 0 ? $7 : $6;
    $3 = $3 - 1 | 0;
    $2 = $2 - 6 | 0;
    $3 = $2 >>> 0 < 4294967290 ? $3 + 1 | 0 : $3;
    $0 = ($1 & 63) << 26 | $0 >>> 6;
    $1 = $1 >>> 6 | 0;
    $4 = $8 - 1 | 0;
    $9 = $9 - 1 | 0;
    $8 = ($9 | 0) != -1 ? $4 + 1 | 0 : $4;
    if ($8 | $9) {
     continue
    }
    break;
   };
  }
  if ($2 | $3) {
   $1 = HEAPU8[($0 & 63) + 6912 | 0];
   $0 = $1 + ($5 << 6) | 0;
   $3 = $6 << 6 | $5 >>> 26;
   $3 = $0 >>> 0 < $1 >>> 0 ? $3 + 1 | 0 : $3;
   $2 = 6 - $2 | 0;
   $1 = $2 & 31;
   if (($2 & 63) >>> 0 >= 32) {
    $8 = 0;
    $5 = $3 >>> $1 | 0;
   } else {
    $8 = $3 >>> $1 | 0;
    $5 = ((1 << $1) - 1 & $3) << 32 - $1 | $0 >>> $1;
   }
   $6 = $8;
  }
  i64toi32_i32$HIGH_BITS = $6;
  return $5;
 }
 
 function _ZN17compiler_builtins3int4udiv10divmod_u6417h6026910b5ed08e40E($0, $1, $2) {
  var $3 = 0, $4 = 0, $5 = 0, $6 = 0, $7 = 0, $8 = 0, $9 = 0, $10 = 0, $11 = 0;
  label$1 : {
   label$2 : {
    label$3 : {
     label$4 : {
      label$5 : {
       label$6 : {
        label$7 : {
         label$9 : {
          label$11 : {
           if ($1) {
            $3 = $2;
            if (!$3) {
             break label$11
            }
            break label$9;
           }
           i64toi32_i32$HIGH_BITS = 0;
           return ($0 >>> 0) / ($2 >>> 0) | 0;
          }
          if (!$0) {
           break label$7
          }
          break label$6;
         }
         if (!($3 - 1 & $3)) {
          break label$5
         }
         $6 = (Math_clz32($3) + 33 | 0) - Math_clz32($1) | 0;
         $5 = 0 - $6 | 0;
         break label$3;
        }
        i64toi32_i32$HIGH_BITS = 0;
        return ($1 >>> 0) / 0 | 0;
       }
       $2 = 32 - Math_clz32($1) | 0;
       if ($2 >>> 0 < 31) {
        break label$4
       }
       break label$2;
      }
      if (($3 | 0) == 1) {
       break label$1
      }
      if ($3) {
       $2 = 31 - Math_clz32($3 - 1 ^ $3) | 0
      } else {
       $2 = 32
      }
      $3 = $2 & 31;
      if (($2 & 63) >>> 0 >= 32) {
       $2 = 0;
       $0 = $1 >>> $3 | 0;
      } else {
       $2 = $1 >>> $3 | 0;
       $0 = ((1 << $3) - 1 & $1) << 32 - $3 | $0 >>> $3;
      }
      i64toi32_i32$HIGH_BITS = $2;
      return $0;
     }
     $6 = $2 + 1 | 0;
     $5 = 63 - $2 | 0;
    }
    $2 = $6 & 63;
    $4 = $2 & 31;
    if ($2 >>> 0 >= 32) {
     $2 = 0;
     $8 = $1 >>> $4 | 0;
    } else {
     $2 = $1 >>> $4 | 0;
     $8 = ((1 << $4) - 1 & $1) << 32 - $4 | $0 >>> $4;
    }
    $5 = $5 & 63;
    $4 = $5 & 31;
    if ($5 >>> 0 >= 32) {
     $1 = $0 << $4;
     $0 = 0;
    } else {
     $1 = (1 << $4) - 1 & $0 >>> 32 - $4 | $1 << $4;
     $0 = $0 << $4;
    }
    if ($6) {
     $5 = $3 - 1 | 0;
     $10 = ($5 | 0) == -1 ? -1 : 0;
     while (1) {
      $7 = $2 << 1 | $8 >>> 31;
      $2 = $8 << 1 | $1 >>> 31;
      $4 = $10 - ($7 + ($2 >>> 0 > $5 >>> 0) | 0) >> 31;
      $9 = $3 & $4;
      $8 = $2 - $9 | 0;
      $2 = $7 - ($2 >>> 0 < $9 >>> 0) | 0;
      $1 = $1 << 1 | $0 >>> 31;
      $0 = $11 | $0 << 1;
      $7 = $4 & 1;
      $11 = $7;
      $6 = $6 - 1 | 0;
      if ($6) {
       continue
      }
      break;
     };
    }
    i64toi32_i32$HIGH_BITS = $1 << 1 | $0 >>> 31;
    return $7 | $0 << 1;
   }
   $0 = 0;
   $1 = 0;
  }
  i64toi32_i32$HIGH_BITS = $1;
  return $0;
 }
 
 bufferView = HEAPU8;
 initActiveSegments(imports);
 var FUNCTION_TABLE = [null, cbAlloc, Xpress9Lz77Dec_MtfCount0_Ptr3, Xpress9Lz77Dec_MtfCount0_Ptr4, Xpress9Lz77Dec_MtfCount2_Ptr3_Mtf2, Xpress9Lz77Dec_MtfCount2_Ptr3_Mtf3, Xpress9Lz77Dec_MtfCount2_Ptr4_Mtf2, Xpress9Lz77Dec_MtfCount2_Ptr4_Mtf3, Xpress9Lz77Dec_MtfCount4_Ptr3_Mtf2, Xpress9Lz77Dec_MtfCount4_Ptr3_Mtf3, Xpress9Lz77Dec_MtfCount4_Ptr4_Mtf2, Xpress9Lz77Dec_MtfCount4_Ptr4_Mtf3];
 function __wasm_memory_size() {
  return buffer.byteLength / 65536 | 0;
 }
 
 function __wasm_memory_grow(pagesToAdd) {
  pagesToAdd = pagesToAdd | 0;
  var oldPages = __wasm_memory_size() | 0;
  var newPages = oldPages + pagesToAdd | 0;
  if ((oldPages < newPages) && (newPages < 65536)) {
   var newBuffer = new ArrayBuffer(Math_imul(newPages, 65536));
   var newHEAP8 = new Int8Array(newBuffer);
   newHEAP8.set(HEAP8);
   HEAP8 = new Int8Array(newBuffer);
   HEAP16 = new Int16Array(newBuffer);
   HEAP32 = new Int32Array(newBuffer);
   HEAPU8 = new Uint8Array(newBuffer);
   HEAPU16 = new Uint16Array(newBuffer);
   HEAPU32 = new Uint32Array(newBuffer);
   HEAPF32 = new Float32Array(newBuffer);
   HEAPF64 = new Float64Array(newBuffer);
   buffer = newBuffer;
   bufferView = HEAPU8;
  }
  return oldPages;
 }
 
 return {
  "memory": Object.create(Object.prototype, {
   "grow": {
    "value": __wasm_memory_grow
   }, 
   "buffer": {
    "get": function () {
     return buffer;
    }
    
   }
  }), 
  "alloc": alloc, 
  "init": init, 
  "decompress": decompress, 
  "reset_heap": reset_heap
 };
}

var retasmFunc = asmFunc({
});
export var memory = retasmFunc.memory;
export var alloc = retasmFunc.alloc;
export var init = retasmFunc.init;
export var decompress = retasmFunc.decompress;
export var reset_heap = retasmFunc.reset_heap;
