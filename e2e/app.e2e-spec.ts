import { PicPiPage } from './app.po';

describe('pic-pi App', () => {
  let page: PicPiPage;

  beforeEach(() => {
    page = new PicPiPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
