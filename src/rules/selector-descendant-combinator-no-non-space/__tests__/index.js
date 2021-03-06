import {
  messages,
  ruleName,
} from ".."
import rules from "../../../rules"
import { testRule } from "../../../testUtils"

const rule = rules[ruleName]

testRule(rule, {
  ruleName,
  config: [true],

  accept: [ {
    code: ".foo.bar {}",
  }, {
    code: ".foo .bar {}",
  }, {
    code: ".foo>.bar {}",
  }, {
    code: ".foo > .bar {}",
  }, {
    code: ".foo  >  .bar {}",
  }, {
    code: ".foo\n>\n.bar {}",
  }, {
    code: ".foo\r\n>\r\n.bar {}",
  } ],

  reject: [ {
    code: ".foo  .bar {}",
    message: messages.rejected("  "),
    line: 1,
    column: 5,
  }, {
    code: ".foo\t.bar {}",
    message: messages.rejected("\t"),
    line: 1,
    column: 5,
  }, {
    code: ".foo\n.bar {}",
    message: messages.rejected("\n"),
    line: 1,
    column: 5,
  }, {
    code: ".foo\r\n.bar {}",
    message: messages.rejected("\r\n"),
    line: 1,
    column: 5,
  } ],
})
