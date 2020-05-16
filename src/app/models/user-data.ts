export class UserData {
  private access_token: string;
  private user: {
    player: {
      id: number;
    };
  };

  public get token() {
    return this.access_token
  }

  public get id() {
    return this.user.player.id
  }
}
