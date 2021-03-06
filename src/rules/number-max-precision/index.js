import {
  atRuleParamIndex,
  declarationValueIndex,
  report,
  ruleMessages,
  validateOptions,
} from "../../utils"

import { isNumber } from "lodash"
import valueParser from "postcss-value-parser"

export const ruleName = "number-max-precision"

export const messages = ruleMessages(ruleName, {
  expected: (number, precision) => `Expected "${number}" to be "${number.toFixed(precision)}"`,
})

export default function (precision) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: precision,
      possible: [isNumber],
    })
    if (!validOptions) { return }

    root.walkAtRules(atRule => {
      if (atRule.name.toLowerCase() === "import") { return }

      check(atRule, atRule.params, atRuleParamIndex)
    })

    root.walkDecls(decl =>
      check(decl, decl.value, declarationValueIndex)
    )

    function check(node, value, getIndex) {
      // Get out quickly if there are no periods
      if (value.indexOf(".") === -1) { return }

      valueParser(value).walk(valueNode => {
        // Ignore `url` function
        if (valueNode.type === "function" && valueNode.value.toLowerCase() === "url") { return false }

        // Ignore strings, comments, etc
        if (valueNode.type !== "word") { return }

        const match = /\d*\.(\d+)/.exec(valueNode.value)

        if (match === null) { return }

        if (match[1].length <= precision) { return }

        report({
          result,
          ruleName,
          node,
          index: getIndex(node) + valueNode.sourceIndex + match.index,
          message: messages.expected(parseFloat(match[0]), precision),
        })
      })
    }
  }
}
