#include <stddef.h>
extern unsigned char __heap_base; static unsigned char *hp=&__heap_base;
void *malloc(size_t n){ n=(n+15)&~15; if((size_t)(hp+n) > __builtin_wasm_memory_size(0)*65536){ size_t need=((size_t)(hp+n)-__builtin_wasm_memory_size(0)*65536+65535)/65536; if(__builtin_wasm_memory_grow(0,need)==(size_t)-1) return 0;} void*p=hp; hp+=n; return p; }
void free(void*p){ (void)p; }
void reset_heap(void){ hp=&__heap_base; }
void *memcpy(void*d,const void*s,size_t n){unsigned char*a=d;const unsigned char*b=s;while(n--)*a++=*b++;return d;}
void *memmove(void*d,const void*s,size_t n){unsigned char*a=d;const unsigned char*b=s;if(a<b)while(n--)*a++=*b++;else{a+=n;b+=n;while(n--)*--a=*--b;}return d;}
void *memset(void*d,int c,size_t n){unsigned char*a=d;while(n--)*a++=(unsigned char)c;return d;}
int snprintf(char*s,unsigned long n,const char*f,...){ if(n) s[0]=0; return 0; }
