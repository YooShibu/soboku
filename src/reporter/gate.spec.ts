import { gate } from "./gate";
import { state } from "../soboku";
import { reporter } from "./reporter";
import { defaultSpy } from "../helper/helper";


describe("gate", () => {
    it("should emit listeners when reporter reports and gatekeeper is true", () => {
        const Biff = reporter<string>();
        const earplug = state(false);
        const Marty = gate(earplug, Biff);
        const r = defaultSpy();
        Marty.report(r.f);
        Biff.next("Hello");
        Biff.next("Hello, hello, anybody home?");
        earplug.next(true);
        Biff.next("Butthead");

        expect(r.f).toHaveBeenCalledTimes(1);
        expect(r.f).toHaveBeenCalledWith("Butthead");
    });
});