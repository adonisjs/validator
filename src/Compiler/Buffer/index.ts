/*
 * @adonisjs/validator
 *
 * (c) Harminder Virk <virk@adonisjs.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */

/**
 * Exposes the API to build a template by writing compiled output
 * to the buffer.
 */
export class CompilerBuffer {
  private lines: string[] = []
  private indentation: number = 0
  private wrappingBlocks: [string, string][] = []

  /**
   * Returns the indentation spaces
   */
  private getIndentationSpaces(): string {
    return new Array(this.indentation + 1).join(' ')
  }

  /**
   * Indent code by 2 spaces
   */
  public indent() {
    this.indentation += 2
    return this
  }

  /**
   * Dedent code by 2 spaces
   */
  public dedent() {
    if (this.indentation === 0) {
      return this
    }

    this.indentation -= 2
    return this
  }

  /**
   * Write a statement to the buffer
   */
  public writeStatement(line: string, multiline: boolean = false) {
    if (multiline) {
      line.split('\n').forEach((one) => this.writeStatement(one))
      return this
    }

    this.lines.push(`${this.getIndentationSpaces()}${line}`)
    return this
  }

  /**
   * Write an expression to the buffer. Colon is appended to
   * expressions.
   */
  public writeExpression(line: string, multiline: boolean = false) {
    if (multiline) {
      const lines = line.split('\n')
      lines.forEach((one, index) => {
        const colon = lines.length === index + 1 ? ';' : ''
        this.lines.push(`${this.getIndentationSpaces()}${one}${colon}`)
      })
      return this
    }

    this.lines.push(`${this.getIndentationSpaces()}${line};`)
    return this
  }

  /**
   * Write a comment to the buffer
   */
  public writeComment(line: string, multiline: boolean = false) {
    if (multiline) {
      line.split('\n').forEach((one) => this.writeComment(one))
      return this
    }

    this.lines.push(`${this.getIndentationSpaces()}// ${line}`)
    return this
  }

  /**
   * Write a new empty line to the buffer
   */
  public newLine() {
    this.lines.push('')
    return this
  }

  /**
   * Define the wrapping code for the output string. To have
   * proper indentation on the output, it is recommended to defined
   * the wrapping blocks upfront.
   */
  public wrappingCode(blocks: [string, string]): this {
    this.wrappingBlocks.push(blocks)
    this.indent()
    return this
  }

  /**
   * Return the string representation of the buffer
   */
  public toString() {
    const start = this.wrappingBlocks.map((block) => block[0])
    const end = this.wrappingBlocks.map((block) => block[1])
    return start.concat(this.lines).concat(end).join('\n')
  }

  /**
   * Same as `toString` but cleans up the internal stored
   * values.
   */
  public flush() {
    const value = this.toString()
    this.lines = []
    this.wrappingBlocks = []
    this.indentation = 0

    return value
  }
}
