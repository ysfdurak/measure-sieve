#include <stddef.h>
#include "xpress9.h"
static void* cbAlloc(void*c,int n){(void)c;extern void*malloc(unsigned long);return malloc((unsigned long)n);}
static XPRESS9_DECODER dec=0;
void *alloc(int n){ extern void*malloc(unsigned long); return malloc((unsigned long)n); }
int init(void){ XPRESS9_STATUS st={0}; dec=Xpress9DecoderCreate(&st,0,cbAlloc,XPRESS9_WINDOW_SIZE_LOG2_MAX,0); if(!dec||st.m_uStatus!=Xpress9Status_OK) return 0; Xpress9DecoderStartSession(&st,dec,1); return st.m_uStatus==Xpress9Status_OK; }
unsigned decompress(unsigned char*src,int sl,unsigned char*dst,int dl){ XPRESS9_STATUS st={0}; unsigned total=0,rem,w,c;
 Xpress9DecoderAttach(&st,dec,src,sl); if(st.m_uStatus!=Xpress9Status_OK) return 0;
 do{ rem=Xpress9DecoderFetchDecompressedData(&st,dec,dst+total,dl-total,&w,&c); if(st.m_uStatus!=Xpress9Status_OK){total=0;break;} if(!w)break; total+=w; }while(rem);
 Xpress9DecoderDetach(&st,dec,src,sl); return total; }
