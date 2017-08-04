import { meetup } from "./meetup";
import { reporter, state } from "../soboku";
import { defaultSpy, IDefaultSpy } from "../helper/helper";


describe("meetup", () => {
    let r: IDefaultSpy;
    beforeEach(() => r = defaultSpy());

    it("should report if every reporters reported", () => {
        const message = reporter<string>();
        const num = state(0);
        const screamer = reporter<string>();
        const m = meetup(message, num, screamer);
        m.report(r.f);

        message.next("Hello");
        num.next(100);
        message.next("Hello?");
        screamer.next("I'm hungry");

        num.next(50);
        screamer.next("I'm hungry!!!");
        message.next("Hello");
        message.next("Hello?");

        expect(r.f).toHaveBeenCalledTimes(2);
        expect(r.f).toHaveBeenCalledWith(true);
    });
    it("should return false by s", () => {
        const m = meetup();
        expect(m.s()).toBeFalsy();
    });

});