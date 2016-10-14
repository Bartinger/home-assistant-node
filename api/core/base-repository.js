class BaseRepository {

	constructor(model) {
		this.modelClass = model;
	}

	save(attributes) {
		var self = this;
		return this.modelClass.forge({id: attributes.id})
			.save(attributes)
			.then(function (model) {
				return self.findById(model.attributes.id);
			});
	}

	list(attributes) {
		return this.modelClass.collection()
			.query({ where: attributes })
			.fetch({ withRelated: this.modelClass.load })
			.then(function (models) {
				if (!models) {
					return [];
				}
				return models.toJSON();
			});
	}

	find(attributes) {
		return this.modelClass.forge(attributes)
			.fetch({ withRelated: this.modelClass.load })
			.then(function (model) {
				if (model) {
					return model.toJSON();
				}
				return null;
			});
	}

	findById(id) {
		return this.find({id: id});
	}

	remove(attributes) {
		return this.modelClass.forge(attributes)
			.destroy();
	}

}

module.exports = BaseRepository;