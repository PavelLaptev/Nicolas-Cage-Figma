declare module "*.scss" {
  const content: { [className: string]: string };
  export = content;
}

declare module "*.jpg" {
  const value: any;
  export default value;
}

declare module "*.mp4" {
  const src: string;
  export default src;
}
