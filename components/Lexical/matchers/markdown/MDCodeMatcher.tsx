import type { ChildrenNode } from "interweave";
import { Matcher } from "interweave";

export class MDCodeMatcher extends Matcher {
  replaceWith(children: ChildrenNode) {
    return (
      <code className="text-sm bg-[#e7e7ea] rounded-lg px-[5px] py-[2px]">
        {children}
      </code>
    );
  }

  asTag(): string {
    return "code";
  }

  match(value: string) {
    return this.doMatch(
      value,
      /`(.*?)`/,
      (matches) => ({
        match: matches[1],
      }),
      true
    );
  }
}
