# SubSpec Model
# ----------

# Match the different expectations of a spec.
# In jasmine, it corresponds to the `expect` function.
class tispec.SubSpec extends Backbone.Model

# Collection of SubSpecs
# ----------------------
class tispec.SubSpecCollection extends Backbone.Collection
  model: tispec.SubSpec
