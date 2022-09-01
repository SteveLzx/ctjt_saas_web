export {};

declare module 'vue/types/vue' {
  interface Vue {
    $http: any;
    $emitter: any;
    $dayjs: any;
    $options: any;
    $print: any;
    $getPerm: any;
  }
}
