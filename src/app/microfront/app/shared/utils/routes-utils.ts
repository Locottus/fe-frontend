export class RoutesUtils {

  public static getPageName = (url: string, routes: any) => {
    return Object.keys(routes).find(
      key => routes[key] === url
    );
  }
}
