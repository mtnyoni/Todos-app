import { formatDate } from "date-fns"
import { createParser } from "nuqs"
import z from "zod"

const anySchema = z.any()
type Any = z.infer<typeof anySchema>

function createZodCodecParser<
	Input extends z.ZodCoercedString<string> | z.ZodPipe<Any, Any>,
	Output extends z.ZodType,
>(
	codec: z.ZodCodec<Input, Output> | z.ZodPipe<Input, Output>,
	eq: (a: z.output<Output>, b: z.output<Output>) => boolean = (a, b) =>
		a === b
) {
	return createParser<z.output<Output>>({
		parse(query) {
			return codec.parse(query)
		},
		serialize(value) {
			return codec.encode(value)
		},
		eq,
	})
}

const dateFilterSchema = z.object({
	period: z.enum(["<", "=", ">"]),
	date: z.date(),
})

const codec = z.codec(z.string(), dateFilterSchema, {
	decode: (value) => {
		const [period, date] = value.split(":")
		return dateFilterSchema.parse({ period, date })
	},
	encode: (value) => {
		return `${value.period}:${formatDate(value.date, "dd-MM-yyyy")}`
	},
})

const dateFilterParser = createZodCodecParser(codec)

export { anySchema, dateFilterParser, dateFilterSchema }
